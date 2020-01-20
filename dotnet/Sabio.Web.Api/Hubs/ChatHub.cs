using Microsoft.AspNetCore.SignalR;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Web.Api.Controllers.Hubs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Sabio.Web
{
    public class ChatHub : Hub
    {

        public static ConnectionMapping<string> _connection = new ConnectionMapping<string>();
        private IContactsService _contactsService = null;
        private IAuthenticationService<int> _auth = null;
        private IChatService _chatService = null;
        private IFilesService _filesService = null;
        IHubContext<ChatHub> _hubContext = null;

        public ChatHub(IContactsService contactsService, IAuthenticationService<int> auth, IChatService chatService, IFilesService filesService, IHubContext<ChatHub> hubContext)
        {   
            _contactsService = contactsService;
            _chatService = chatService;
            _filesService = filesService;
            _auth = auth;
            _hubContext = hubContext;
        }

        public async Task AddContact(string email)
        {
            int userId = _auth.GetCurrentUserId();

            try
            {
                Contact contact = _contactsService.AddContact(userId, email);
                await Clients.User($"{userId}").SendAsync("ReceiveSingleContact", contact);
            }
            catch (Exception ex)
            {
                await Clients.User($"{userId}").SendAsync("ReceiveSingleContact", null, ex);
            }
        }

        public async Task DeleteContact(int contact)
        {
            int userId = _auth.GetCurrentUserId();

            try
            {
                _contactsService.DeleteContact(userId, contact);
                await Clients.User($"{userId}").SendAsync("DeleteContact", contact);
            }
            catch (Exception ex)
            {
                await Clients.User($"{userId}").SendAsync("DeleteContact", null, ex);
            }
        }

        public async Task DownloadChatHistory(int interlocutor)
        {
            int userId = _auth.GetCurrentUserId();

            MemoryStream stream = _chatService.DownloadChatHistory(userId, interlocutor);
            if (stream != null)
            {
                byte[] streamBytes = stream.ToArray();
                await Clients.User($"{userId}").SendAsync("DownloadChat", streamBytes, interlocutor);
            }
            else
            {
                await Clients.User($"{userId}").SendAsync("DownloadChat", null);
            }
        }

        public async Task GetContacts()
        {

            int userId = _auth.GetCurrentUserId();

            try
            {
                List<Contact> contacts = _contactsService.GetContacts(userId);
                if (contacts == null)
                {
                    await Clients.User($"{userId}").SendAsync("ReceiveContacts", null);
                }
                else
                {
                    foreach (Contact contact in contacts)
                    {
                        IEnumerable<string> isConnected = _connection.GetConnections(contact.Id.ToString());
                        contact.IsOnline = IsNullOrEmpty<string>(isConnected) ? false : true;
                    }
                    await Clients.User($"{userId}").SendAsync("ReceiveContacts", contacts);
                }
            }
            catch (Exception ex)
            {
                await Clients.User($"{userId}").SendAsync("ReceiveContacts", null, ex);
            }
        }
           
        public void GetMetaData(string url, int messageId, string guid)
        {
     
            int userId = _auth.GetCurrentUserId();          
            
            new Thread(async () =>
            {          
                MetaInformation meta = _chatService.GetMetaData(url);
                await _hubContext.Clients.User($"{userId}").SendAsync("ReceiveMetaData", meta, messageId, guid);
                IDisposable d = _hubContext as IDisposable;
                d?.Dispose();
                  
            }).Start();           
        }

        public async Task GetRecentMessages(int interlocutor)
        {
            int userId = _auth.GetCurrentUserId();

            try
            {

                List<Message> messages = _chatService.GetRecentMessages(userId, interlocutor);
                if(messages != null)
                {

                    new Thread(async () =>
                    {
                        GetFileData(messages);
                        await _hubContext.Clients.User($"{userId}").SendAsync("ReceiveRecentMessages", interlocutor, messages);
                        IDisposable d = _hubContext as IDisposable;
                        d?.Dispose();
                    }).Start();
                  
                } else
                {
                    await Clients.User($"{userId}").SendAsync("ReceiveRecentMessages", interlocutor, null);
                }
            }
            catch (Exception ex)
            {
                await Clients.User($"{userId}").SendAsync("ReceiveRecentMessages", interlocutor, null, ex);
            }
        }

        public async Task SendMessage(int recipient, string text, List<string> files)
        {
            int userId = _auth.GetCurrentUserId();

            try
            {
                List<string> urls = null;

                if (files != null)
                {
                    
                    List<string> uploadResponses = _filesService.UploadMultipleV2(files);
                    if(urls == null)
                    {
                    urls = new List<string>();
                    }
                    uploadResponses.ForEach(url => urls.Add(url));
                }

                MessageAddRequest message = new MessageAddRequest();
                message.Recipient = recipient;
                message.Text = text;
                Message newMessage = _chatService.AddMessage(userId, message, urls);
                if (newMessage == null)
                {

                    await Clients.Users($"{userId}", $"{recipient}").SendAsync("ReceiveMessage", null);
                }
                else
                {
                    newMessage.FileData = new List<string>();
                    newMessage.FileData = files;
                    if (newMessage.SenderInfo != null)
                    {
                        await Clients.User($"{recipient}").SendAsync("ReceiveSingleContact", newMessage.SenderInfo);
                        await Clients.Users($"{userId}", $"{recipient}").SendAsync("ReceiveMessage", newMessage, 3);
                    }
                    else
                    {
                        await Clients.Users($"{userId}", $"{recipient}").SendAsync("ReceiveMessage", newMessage, 1);
                    }

                }
            }
            catch (Exception ex)
            {
                await Clients.User($"{userId}").SendAsync("ReceiveMessage", null, null, ex);
            }

        }

        public async Task UpdateDateRead(int sender)
        {
            int recipient = _auth.GetCurrentUserId();
            try
            {
                _chatService.UpdateDateRead(sender, recipient);
                await Clients.User($"{recipient}").SendAsync("MarkRead", sender);
            }
            catch (Exception ex)
            {
                await Clients.User($"{recipient}").SendAsync("MarkRead", sender, ex);
            }
        }

        public override Task OnConnectedAsync()
        {
            string name = Context.UserIdentifier;
            _connection.Add(name, Context.ConnectionId);

            try
            {
                int idString = Int32.Parse(name);
                List<Contact> contacts = _contactsService.GetContacts(idString); //this will be refactored in a week to a memcache server
                List<string> onlineContacts = null;
                if (contacts != null)
                {

                    onlineContacts = contacts.Where(c =>
                    {
                        IEnumerable<string> isConnected = _connection.GetConnections(c.Id.ToString());
                        return IsNullOrEmpty<string>(isConnected) ? false : true;
                    }).Select(c => c.Id.ToString()).ToList();

                    Clients.Users(onlineContacts).SendAsync("LogOnContact", idString);
                }
            }

            //not sure if this is right
            catch (Exception ex)
            {
                Clients.User($"{name}").SendAsync("LogOnContact", null, ex);
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception ex)
        {
            string name = Context.UserIdentifier;
            _connection.Remove(name, Context.ConnectionId);

            try
            {
                int idString = Int32.Parse(name);
                List<Contact> contacts = _contactsService.GetContacts(idString);

                if (contacts != null)
                {

                    List<string> onlineContacts = contacts.Where(c =>
                    {
                        IEnumerable<string> isConnected = _connection.GetConnections(c.Id.ToString());
                        return IsNullOrEmpty<string>(isConnected) ? false : true;
                    }).Select(c => c.Id.ToString()).ToList();

                    Clients.Users(onlineContacts).SendAsync("LogOffContact", idString);
                }
            }

            //not sure if this next part is correct
            catch (Exception ex2)
            {
                return base.OnDisconnectedAsync(ex2);
            }
            return base.OnDisconnectedAsync(ex);
        }

        private static bool IsNullOrEmpty<T>(IEnumerable<T> list)
        {
            return !(list?.Any() ?? false);
        }         
        
        private static void GetFileData(List<Message> messages)
        {
            foreach (Message message in messages)
            {
                if (message?.Urls != null && message?.Urls !="")
                {
                    message.FileData = null;
                    WebClient client = new WebClient();
                    string[] urls = message.Urls.Split(", ");
                    foreach (string url in urls)
                    {
                        Stream stream = client.OpenRead(url);
                        byte[] bytes;
                        using (var memoryStream = new MemoryStream())
                        {
                            stream.CopyTo(memoryStream);
                            bytes = memoryStream.ToArray();
                        }

                        string base64 = Convert.ToBase64String(bytes);
                        if (message.FileData == null)
                        {
                            message.FileData = new List<string>();
                            
                        }
                        message.FileData.Add(base64);
                    }
                }
            }          
        }

    }
}
