using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Chat
{
    public class Interlocutor
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
