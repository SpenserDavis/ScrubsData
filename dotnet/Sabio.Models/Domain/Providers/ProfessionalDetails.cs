using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProfessionalDetails
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public int NPI { get; set; }
        public TypeTableBase GenderAccepted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
    }
}
