using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.RegularExpressions;

namespace Sabio.Models.Requests.Users
{
    public class ValidPassword : ValidationAttribute
    {

        public override bool IsValid(object value)
        {
            var input = value as string;
            ErrorMessage = string.Empty;

            if (string.IsNullOrWhiteSpace(input))
            {
                throw new Exception("Password should not be empty.");
            }

            var hasWhiteSpace = new Regex(@" +");
            var hasNumber = new Regex(@"[0-9]+");
            var hasUpperChar = new Regex(@"[A-Z]+");
            var hasMiniMaxChars = new Regex(@"^.{8,100}$");
            var hasLowerChar = new Regex(@"[a-z]+");
            var hasSymbols = new Regex(@"[!@#$%^&*()_+=\[{\]};:<>|./?,-]");


            if (hasWhiteSpace.IsMatch(input))
            {
                ErrorMessage = "Password must not contain whitespace.";
                return false;
            }
            if (!hasLowerChar.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one lowercase letter.";
                return false;
            }
            else if (!hasUpperChar.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one uppercase letter.";
                return false;
            }
            else if (!hasMiniMaxChars.IsMatch(input))
            {
                ErrorMessage = "Password should be between 8 and 100 (inclusive) characters long.";
                return false;
            }
            else if (!hasNumber.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one number.";
                return false;
            }

            else if (!hasSymbols.IsMatch(input))
            {
                ErrorMessage = "Password should contain at least one symbol.";
                return false;
            }
            else
            {
                return true;
            }
        }

    }
}
