using Sabio.Models.Domain.TypeTables;
using Sabio.Models.Requests.Locations;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class ProviderBase
    {
        public int Id { get; set; }
        public int GenderTypeId { get; set; }
        public int TitleTypeId { get; set; }
        public int UserProfileId { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public TypeTableBase Gender { get; set; }
        public TypeTableBase Title { get; set; }
    }
}
