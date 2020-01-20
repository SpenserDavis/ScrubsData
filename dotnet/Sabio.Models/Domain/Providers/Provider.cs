using Sabio.Models.Domain.InsurancePlans;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class Provider : ProviderBase
    {
        public List<Location> Location { get; set; }
        public ProfessionalDetails ProfessionalDetails { get; set; }
        public List<Practice> Practices { get; set; }
        public List<Affiliation> Affiliations { get; set; }
        public List<Certification> Certifications { get; set; }
        public List<Expertise> Expertise { get; set; }
        public List<Language> Languages { get; set; }
        public List<ProviderLicense> Licenses { get; set; }
        public List<Specialization> Specializations { get; set; }
        public List<InsurancePlan> InsurancePlans { get; set; }
        public int LastAttested { get; set; }
        public UserProfile UserProfile { get; set; }
    }
}
