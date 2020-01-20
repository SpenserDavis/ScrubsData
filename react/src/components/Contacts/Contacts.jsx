import React from "react";
import ContactList from "./ContactList";
import MessageWindow from "./MessageWindow";
import logger from "sabio-debug";
import ContactCard from "./ContactCard";
import _ from "lodash";
import * as SignalR from "@aspnet/signalr";
import handleExceptions from "./exceptionHandling";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { API_HOST_PREFIX } from "../../services/serviceHelpers";

const _logger = logger.extend("Contacts");

class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeContact: null,
      components: { contactCards: [], searched: [] },
      contacts: [],
      dragCounter: 0,
      files: [],
      isLoading: true,
      message: "",
      messages: [],
      searchTerm: ""
    };
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${API_HOST_PREFIX}/chatHub`)
      .configureLogging(SignalR.LogLevel.Information)
      .build();
    this.hubProcs = {
      //hubProcName: hubProc
      DeleteContact: this.handleDeleteContact,
      MarkRead: this.markMessagesRead,
      LogOffContact: this.toggleContactStatus,
      LogOnContact: this.toggleContactStatus,
      ReceiveContacts: this.mapContactsToState,
      ReceiveMessage: this.mapSingleMessageToState,
      ReceiveRecentMessages: this.mapMessagesToState,
      ReceiveSingleContact: this.mapSingleContactToState
    };
    this.windowEvents = {
      //event: eventListener
      dragenter: this.onDragEnter,
      dragleave: this.onDragLeaveOrDrop,
      drop: this.onDragLeaveOrDrop
    };
  }

  componentDidMount() {
    this.configureHub();
    this.registerEventListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeContact } = this.state;
    if (activeContact) {
      if (prevState.activeContact) {
        if (prevState.activeContact.id !== activeContact.id) {
          this.hubConnection
            .invoke("GetRecentMessages", activeContact.id)
            .catch(err => _logger(err));
        }
      }
    }
  }

  componentWillUnmount() {
    this.unregisterHubProcs();
    this.unregisterEventListeners();
  }

  configureHub = () => {
    this.hubConnection
      .start()
      .then(this.initializeContacts)
      .catch(this.handleHubConnectionFailure);

    for (let key in this.hubProcs) {
      this.hubConnection.on(key, this.hubProcs[key]);
    }
  };

  unregisterHubProcs = () => {
    for (let key in this.hubProcs) {
      this.unsubscribe(key);
    }
  };

  unsubscribe = service => {
    this.hubConnection.off(service);
  };

  registerEventListeners = () => {
    for (let key in this.windowEvents) {
      window.addEventListener(key, this.windowEvents[key]);
    }
  };

  unregisterEventListeners = () => {
    for (let key in this.windowEvents) {
      window.removeEventListener(key, this.windowEvents[key]);
    }
  };

  onDragEnter = () => {
    if (this.state.activeContact) {
      this.setState(prevState => ({
        dragCounter: (prevState.dragCounter += 1)
      }));
    }
  };

  onDragLeaveOrDrop = () => {
    if (this.state.activeContact) {
      this.setState(prevState => ({
        dragCounter: (prevState.dragCounter -= 1)
      }));
    }
  };

  mapMessagesToState = (interlocutor, data, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }
    if (!data || interlocutor !== this.state.activeContact.id) {
      this.setState({ isLoading: false });
      return;
    }
    let messages = _.reverse(_.sortBy(data, obj => obj.DateSent));
    this.setState({ message: "", messages, isLoading: false }, () => {
      this.modifyUnreadCount(this.state.activeContact.id, 0);
    });
  };

  mapSingleMessageToState = (message, unreadModifier, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }

    const { activeContact } = this.state;
    const { sender, recipient } = message;
    if (activeContact) {
      if (activeContact.id === sender.id || activeContact.id === recipient.id) {
        this.setState(
          prevState => {
            let messages = [...prevState.messages];
            messages.push(message);
            return { messages };
          },
          () => {
            this.modifyUnreadCount(activeContact.id, 0);
          }
        );
      } else {
        this.modifyUnreadCount(sender.id, unreadModifier);
      }
    } else {
      this.modifyUnreadCount(sender.id, unreadModifier);
    }

    if (sender.id === this.props.currentUser.id) {
      this.shiftContact(recipient.id);
    } else {
      this.shiftContact(sender.id);
    }
  };

  toggleContactStatus = id => {
    let contacts = [...this.state.contacts];
    let target, editedContact;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        target = i;
        contacts[i].isOnline = !contacts[i].isOnline;
        editedContact = contacts[i];
        break;
      }
    }
    let contactCards = [...this.state.components.contactCards];
    contactCards.splice(
      target,
      1,
      <ContactCard
        key={`contact-${editedContact.id}`}
        contact={editedContact}
        {...this.contactCardProps}
      />
    );
    this.setState({
      contacts,
      components: { ...this.state.components, contactCards }
    });
  };

  markMessagesRead = (sender, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }
    this.modifyUnreadCount(sender, 0);
  };

  handleDeleteContact = (id, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }

    let target;
    let { activeContact, components } = this.state;
    let contacts = [...this.state.contacts];

    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        target = i;
        contacts.splice(target, 1);
        break;
      }
    }
    let contactCards = [...this.state.components.contactCards];
    contactCards.splice(target, 1);

    if (activeContact) {
      if (id === activeContact.id) {
        this.setState({
          contacts,
          activeContact: null,
          components: { ...components, contactCards }
        });
        return;
      }
    }

    this.setState({
      contacts,
      components: { ...components, contactCards }
    });
  };

  handleHubConnectionFailure = err => {
    _logger("Error connecting SignalR - " + err);
    this.props.history.push("/");
    Swal.fire({ title: "Oops!", text: "Feature out of order." });
  };

  initializeContacts = () => {
    this.contactCardProps = {
      hubConnection: this.hubConnection,
      unsubscribe: this.unsubscribe,
      makeActiveContact: this.makeActiveContact
    };
    this.hubConnection.invoke("GetContacts").catch(err => _logger(err));
  };

  makeActiveContact = activeContact => {
    if (activeContact !== this.state.activeContact) {
      this.setState({
        activeContact,
        message: "",
        messages: [],
        files: [],
        isLoading: true
      });
    }
  };

  mapContactsToState = (res, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }
    if (!res) {
      return;
    }
    let sortedContacts = _.reverse(_.sortBy(res, obj => obj.dateModified));
    let contacts = sortedContacts.map(contact => {
      return { ...contact, roles: this.formatRoles(contact.roles) };
    });
    let contactCards = contacts.map(contact => {
      return (
        <ContactCard
          key={`contact-${contact.id}`}
          contact={contact}
          {...this.contactCardProps}
        />
      );
    });
    this.setState({
      contacts,
      components: { ...this.state.components, contactCards }
    });
  };

  mapSingleContactToState = (contact, ex) => {
    if (ex) {
      _logger(ex);
      handleExceptions(ex);
      return;
    }

    let contacts = [...this.state.contacts];
    let contactCards = [...this.state.components.contactCards];
    contact = {
      ...contact,
      roles: this.formatRoles(contact.roles)
    };
    contacts.unshift(contact);
    contactCards.unshift(
      <ContactCard
        key={`contact-${contact.id}`}
        contact={contact}
        {...this.contactCardProps}
      />
    );
    this.setState({
      contacts,
      components: { ...this.state.components, contactCards }
    });
  };

  formatRoles = roles => {
    let role = "";
    if (roles) {
      if (roles.includes("SysAdmin")) {
        role = "SysAdmin";
      } else if (roles.includes("Provider")) {
        role = "Provider";
      } else if (roles.includes("OfficeManager")) {
        role = "Office Manager";
      } else if (roles.includes("OfficeAssistant")) {
        role = "Office Assistant";
      } else if (roles.includes("Consumer")) {
        role = "Tenant Rep";
      }
    }
    return role;
  };

  filterContacts = searchTerm => {
    searchTerm = searchTerm.toLowerCase();
    let searched = [];
    const { contacts, components } = this.state;
    contacts.forEach((contact, i) => {
      if (contact.firstName) {
        if (contact.firstName.toLowerCase().includes(searchTerm)) {
          searched.push(components.contactCards[i]);
        }
      } else if (contact.lastName) {
        if (contact.lastName.toLowerCase().includes(searchTerm)) {
          searched.push(components.contactCards[i]);
        }
      }
    });

    this.setState({ components: { ...components, searched } });
  };

  handleSearchInputChange = val => {
    this.setState({ searchTerm: val }, () =>
      this.filterContacts(this.state.searchTerm)
    );
  };

  modifyUnreadCount = (id, modifier) => {
    let contacts = [...this.state.contacts];
    let target, editedContact;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        target = i;
        if (modifier === 1) {
          contacts[i].unreadCount += 1;
        } else if (modifier === 0) {
          contacts[i].unreadCount = 0;
        } else {
          contacts[i].unreadCount = 1;
        }
        editedContact = contacts[i];
        break;
      }
    }
    let contactCards = [...this.state.components.contactCards];
    contactCards.splice(
      target,
      1,
      <ContactCard
        key={`contact-${editedContact.id}`}
        contact={editedContact}
        {...this.contactCardProps}
      />
    );
    this.setState({
      contacts,
      components: { ...this.state.components, contactCards }
    });
  };

  shiftContact = id => {
    let contacts = [...this.state.contacts];
    let target;
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) {
        target = i;
        let temp = contacts[i];
        contacts.splice(i, 1);
        contacts.unshift(temp);
        break;
      }
    }
    let contactCards = [...this.state.components.contactCards];

    let temp = contactCards[target];
    contactCards.splice(target, 1);
    contactCards.unshift(temp);

    this.setState({
      contacts,
      components: { ...this.state.components, contactCards }
    });
  };

  setLoading = () => {
    this.setState({ isLoading: true });
  };

  sendMessage = () => {
    const { message, activeContact, files } = this.state;
    let fileCollection;
    if (files.length > 0) {
      fileCollection = [];
      files.forEach(({ src }) => {
        let index = src.indexOf(";base64,");
        let base64String = src.slice(index + 8, src.length);
        _logger({ src, base64String });
        fileCollection.push(base64String);
      });
    }

    this.hubConnection.invoke(
      "SendMessage",
      activeContact.id,
      message,
      fileCollection
    );

    this.setState({ message: "", files: [] });
  };

  handleMessageInputChange = message => {
    this.setState({ message });
  };

  mapFilesToState = files => {
    this.setState({ files });
  };

  removeAttachment = val => {
    _logger("remove req", val);
    let files = [...this.state.files];
    files.splice(val, 1);
    this.setState({ files });
  };

  render() {
    const {
      components,
      activeContact,
      searchTerm,
      files,
      message,
      messages,
      dragCounter
    } = this.state;
    const dragStyles = dragCounter ? "drag" : "";
    return (
      <React.Fragment>
        <div className={dragStyles}>
          <div className={`left-part bg-white ${dragStyles}`}>
            <ContactList
              contacts={
                searchTerm ? components.searched : components.contactCards
              }
              dragCounter={dragCounter}
              filterContacts={this.filterContacts}
              hubConnection={this.hubConnection}
              makeActiveContact={this.makeActiveContact}
              onSearchInputChange={this.handleSearchInputChange}
              searchTerm={searchTerm}
            />
          </div>
          {activeContact && this.hubConnection && (
            <div className={`right-part bg-white chat-list ${dragStyles}`}>
              <MessageWindow
                activeContact={activeContact}
                dragCounter={dragCounter}
                files={files}
                hubConnection={this.hubConnection}
                isLoading={this.state.isLoading}
                mapFilesToState={this.mapFilesToState}
                message={message}
                messages={messages}
                modifyUnreadCount={this.modifyUnreadCount}
                onMessageInputChange={this.handleMessageInputChange}
                removeAttachment={this.removeAttachment}
                sendMessage={this.sendMessage}
                setLoading={this.setLoading}
                shiftContact={this.shiftContact}
                unsubscribe={this.unsubscribe}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Contacts;

Contacts.propTypes = {
  currentUser: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func })
};
