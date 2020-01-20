using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderPractices
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Location Location { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string SiteUrl { get; set; }
        public TypeTableDetails FacilityType { get; set; }
        public int ScheduleId { get; set; }
        public bool IsAdaAccessible  { get; set; }
        public TypeTableBase GenderAccepted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }

    }
}
