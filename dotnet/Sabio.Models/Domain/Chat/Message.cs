using Sabio.Models.Domain.Chat;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Message
    {
        public int Id { get; set; }
        public Interlocutor Sender { get; set; }
        public Interlocutor Recipient { get; set; }
        public string Text { get; set; }
        public string Urls { get; set; }
        public List<string> FileData { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public Contact SenderInfo { get; set; }
    }
}
