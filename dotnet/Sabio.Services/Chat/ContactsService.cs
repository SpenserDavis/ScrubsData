using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class ContactsService : IContactsService
    {

        IDataProvider _data = null;

        public ContactsService(IDataProvider provider)
        {
            _data = provider;
        }

        public Contact AddContact(int userId, string email)
        {
            string procName = "[dbo].[UserContacts_Insert_ByEmail]";
          
            Contact contact = null;
            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
                paramCol.AddWithValue("@email", email);

            }, (reader, set) =>
            {
                contact = HydrateContact(reader);                
            }
            );
            return contact;
        }
        public void DeleteContact(int userId, int contactId)
        {
            string procName = "[dbo].[UserContacts_Delete]";

            _data.ExecuteNonQuery(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
                paramCol.AddWithValue("@contactId", contactId);
            });
        }
        public List<Contact> GetContacts(int userId)
        {

            string procName = "[dbo].[UserContacts_Select_ById]";
            List<Contact> list = null;


            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@userId", userId);
            }, (reader, set) =>
            {
                Contact contact = HydrateContact(reader);

                if (list == null)
                {
                    list = new List<Contact>();
                }
                if (contact != null)
                {
                    list.Add(contact);
                }
            }
            );
            return list;
        }

        public static Contact HydrateContact(IDataReader reader)
        {
            int index = 0;
            Contact contact = new Contact();
            contact.Id = reader.GetSafeInt32(index++);
            contact.DateModified = reader.GetSafeDateTime(index++);
            contact.FirstName = reader.GetSafeString(index++);
            contact.LastName = reader.GetSafeString(index++);
            contact.AvatarUrl = reader.GetSafeString(index++);
            contact.Email = reader.GetSafeString(index++);
            contact.Roles = null;
            string roles = reader.GetSafeString(index++);
            if (roles != null)
            {
                string[] roleArr = roles.Split(",");
                contact.Roles = new List<string>();
                foreach (string role in roleArr)
                {
                    contact.Roles.Add(role);
                }
            }
            contact.UnreadCount = reader.GetSafeInt32(index++);
            return contact;
        }
    }
}
