using HtmlAgilityPack;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Chat;
using Sabio.Models.Requests.Messages;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace Sabio.Services
{
    public class ChatService : IChatService
    {
        IDataProvider _data = null;
        public ChatService(IDataProvider data)
        {
            _data = data;
        }

        public Message AddMessage(int currUser, MessageAddRequest message, List<string> urls)
        {
            string procName = "[dbo].[Chat_Insert]";
            int messageId = 0;
            DateTime dateSent = DateTime.MinValue;
            Contact contact = null;
            string urlJSON = "";

            if(urls != null)
            {
                foreach (string url in urls)
                {
                    if (urlJSON != "")
                    {
                        urlJSON += $", {url}";
                    }
                    else
                    {
                        urlJSON += url;
                    }

                }
            }
           

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@sender", currUser);
                paramCol.AddWithValue("@recipient", message.Recipient);
                paramCol.AddWithValue("@message", message.Text);
                paramCol.AddWithValue("@urls", urlJSON);

                SqlParameter messageIdOut = new SqlParameter("@messageId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                SqlParameter dateSentOut = new SqlParameter("@dateSent", SqlDbType.DateTime)
                {
                    Direction = ParameterDirection.Output
                };

                paramCol.Add(messageIdOut);
                paramCol.Add(dateSentOut);
        
            },(reader, set)=> 
            {
                contact = ContactsService.HydrateContact(reader);
            } ,returnParams =>
            {
                Object oid = returnParams["@messageId"].Value;
                Object ots = returnParams["@dateSent"].Value;         
                Int32.TryParse(oid.ToString(), out messageId);
                DateTime.TryParse(ots.ToString(), out dateSent);
            });

            Message formattedMessage = new Message();
            Interlocutor sender = new Interlocutor();
            sender.Id = currUser;
            formattedMessage.Sender = sender;
            Interlocutor recipient = new Interlocutor();
            recipient.Id = message.Recipient;
            formattedMessage.Recipient = recipient;      
            formattedMessage.Text = message.Text;
            formattedMessage.Urls = urlJSON;
            formattedMessage.Id = messageId;
            formattedMessage.DateSent = dateSent;        
            formattedMessage.SenderInfo = contact;
            return formattedMessage;
        }

        public MemoryStream DownloadChatHistory(int currUser, int interlocutor)
        {
            string procName = "[dbo].[Chat_Select_AllMessages]";
            List<Message> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@currUser", currUser);
                paramCol.AddWithValue("@interlocutor", interlocutor);
            }, (reader, set) =>
            {

                Message message = HydrateMessageForHistory(reader);
                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);

            });

            var stream = new MemoryStream();
            using(var package = new ExcelPackage(stream))
            {
                ExcelWorksheet chat = package.Workbook.Worksheets.Add("Chat History");
                int index = 1;
                ModifyExcelHeaders(chat, out index);
                using (var r = chat.Cells[1, 1, 1, index - 1])
                {
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                }

                int rowIndex = 2;
                foreach(Message message in list)
                {
                    PopulateCellData(chat, message, rowIndex);
                    rowIndex++;
                }
               
                chat.Column(9).Style.Numberformat.Format = "mm-dd-yyy, hh:mm AM/PM";
                chat.Column(10).Style.Numberformat.Format = "mm-dd-yyy, hh:mm AM/PM";
                chat.Cells.AutoFitColumns(0, 50);
                chat.Column(9).Width = 23;
                chat.Column(10).Width = 23;        
                package.Workbook.Properties.Title = "Chat History";
                package.Workbook.Properties.Author = "Scrubs Data";
                
                package.Save();

            }         
                 

            return stream;
        }

        public MetaInformation GetMetaData(string url)
        {
            // Get the URL specified
            MetaInformation metaInfo = null;
            try
            {
                var webGet = new HtmlWeb();
                var document = webGet.Load(url);
                var metaTags = document.DocumentNode.SelectNodes("//meta");
                metaInfo = new MetaInformation(url);
                if (metaTags != null)
                {
                    int matchCount = 0;
                    foreach (var tag in metaTags)
                    {
                        var tagName = tag.Attributes["name"];
                        var tagContent = tag.Attributes["content"];
                        var tagProperty = tag.Attributes["property"];
                        if (tagName != null && tagContent != null)
                        {
                            switch (tagName.Value.ToLower())
                            {
                                case "title":
                                    metaInfo.Title = tagContent.Value;
                                    matchCount++;
                                    break;
                                case "description":
                                    metaInfo.Description = tagContent.Value;
                                    matchCount++;
                                    break;
                                case "twitter:title":
                                    metaInfo.Title = string.IsNullOrEmpty(metaInfo.Title) ? tagContent.Value : metaInfo.Title;
                                    matchCount++;
                                    break;
                                case "twitter:description":
                                    metaInfo.Description = string.IsNullOrEmpty(metaInfo.Description) ? tagContent.Value : metaInfo.Description;
                                    matchCount++;
                                    break;
                                case "keywords":
                                    metaInfo.Keywords = tagContent.Value;
                                    matchCount++;
                                    break;
                                case "twitter:image":
                                    metaInfo.ImageUrl = string.IsNullOrEmpty(metaInfo.ImageUrl) ? tagContent.Value : metaInfo.ImageUrl;
                                    matchCount++;
                                    break;
                            }
                        }
                        else if (tagProperty != null && tagContent != null)
                        {
                            switch (tagProperty.Value.ToLower())
                            {
                                case "og:title":
                                    metaInfo.Title = string.IsNullOrEmpty(metaInfo.Title) ? tagContent.Value : metaInfo.Title;
                                    matchCount++;
                                    break;
                                case "og:description":
                                    metaInfo.Description = string.IsNullOrEmpty(metaInfo.Description) ? tagContent.Value : metaInfo.Description;
                                    matchCount++;
                                    break;
                                case "og:image":
                                    metaInfo.ImageUrl = string.IsNullOrEmpty(metaInfo.ImageUrl) ? tagContent.Value : metaInfo.ImageUrl;
                                    matchCount++;
                                    break;
                            }
                        }
                    }
                    metaInfo.HasData = matchCount > 0;
                }
            } catch (Exception ex)
            {
                metaInfo = new MetaInformation(url);
                return metaInfo;
            }
            
            return metaInfo;
        }
        
        public List<Message> GetRecentMessages(int currUser, int interlocutor)
        {
            string procName = "[dbo].[Chat_Select_RecentMessages]";
            List<Message> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@currUser", currUser);
                paramCol.AddWithValue("@interlocutor", interlocutor);
            }, (reader, set) =>
            {

                Message message = HydrateMessage(reader);
                if (list == null)
                {
                    list = new List<Message>();
                }

                list.Add(message);

            });

            return list;
        }

        public void UpdateDateRead(int sender, int recipient)
        {
            string procName = "[dbo].[Chat_Update_DateRead]";

            _data.ExecuteNonQuery(procName, paramCol =>
            {
                paramCol.AddWithValue("@sender", sender);
                paramCol.AddWithValue("@recipient", recipient);
            }
            );
        }

        private Message HydrateMessage(IDataReader reader)
        {
            Message message = new Message();
            int index = 0;
            message.Id = reader.GetSafeInt32(index++);
            Interlocutor sender = new Interlocutor();
            sender.Id = reader.GetSafeInt32(index++);
            message.Sender = sender;
            Interlocutor recipient = new Interlocutor();
            recipient.Id = reader.GetSafeInt32(index++);
            message.Recipient = recipient;
            message.Text = reader.GetSafeString(index++);
            message.Urls = reader.GetSafeString(index++);
            message.DateSent = reader.GetSafeDateTime(index++);
            message.DateRead = reader.GetSafeDateTime(index++);
            return message;
        }

        private Message HydrateMessageForHistory(IDataReader reader)
        {
            Message message = new Message();
            int index = 0;
            message.Id = reader.GetSafeInt32(index++);
            message.Sender = reader.GetSafeJSON<Interlocutor>(index++);
            message.Recipient = reader.GetSafeJSON<Interlocutor>(index++);
            message.Text = reader.GetSafeString(index++);
            message.Urls = reader.GetSafeString(index++);
            message.DateSent = reader.GetSafeDateTime(index++);
            message.DateRead = reader.GetSafeDateTime(index++);
           
            return message;
        }

        private void ModifyExcelHeaders(ExcelWorksheet worksheet, out int index)
        {
            index = 1;
            worksheet.Cells[1, index++].Value = "Sender Email";
            worksheet.Cells[1, index++].Value = "Sender First Name";
            worksheet.Cells[1, index++].Value = "Sender Last Name";
            worksheet.Cells[1, index++].Value = "Recipient Email";
            worksheet.Cells[1, index++].Value = "Recipient First Name";
            worksheet.Cells[1, index++].Value = "Recipient Last Name";
            worksheet.Cells[1, index++].Value = "Message";
            worksheet.Cells[1, index++].Value = "Attachments";
            worksheet.Cells[1, index++].Value = "Date Sent";
            worksheet.Cells[1, index++].Value = "Date Read";
        }

        private void PopulateCellData(ExcelWorksheet worksheet, Message message, int rowIndex)
        {
            int colIndex = 1;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Sender.Email;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Sender.FirstName;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Sender.LastName;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Recipient.Email;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Recipient.FirstName;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Recipient.LastName;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Text;
            worksheet.Cells[rowIndex, colIndex++].Value = message.Urls;
            worksheet.Cells[rowIndex, colIndex++].Value = message.DateSent;
            if (message.DateRead == default(DateTime))
            {
                worksheet.Cells[rowIndex, colIndex++].Value = "";
            } else
            {
                worksheet.Cells[rowIndex, colIndex++].Value = message.DateRead;
            }
            
        }
    }

}





      