using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProfessionalDetailsReport
    {
        public int Id { get; set; }    
        public int NPI { get; set; }
        public string GendersAccepted { get; set; }
    }
}
