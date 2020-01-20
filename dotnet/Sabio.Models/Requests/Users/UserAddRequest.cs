using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.RegularExpressions;

namespace Sabio.Models.Requests.Users
{
    public class UserAddRequest
    {
        [Required]
        [EmailAddress, StringLength(100, MinimumLength = 5)]
        public string Email { get; set; }

        [Required]
        [ValidPassword]
        [StringLength(100, MinimumLength = 5)]
        public string Password { get; set; }

        [Compare(nameof(Password), ErrorMessage = "Passwords mismatch.")]
        public string PasswordConfirm { get; set; }

    }
}
