using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Contact
    {
        public int Id { get; set; }
        public DateTime DateModified { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; }
        public int UnreadCount { get; set; }
        public bool IsOnline { get; set; }
    }
}
