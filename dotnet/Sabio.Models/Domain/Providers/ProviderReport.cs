using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderReport
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string Mi { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string  Email { get; set; }
        public int UserId { get; set; }
        public DateTime DateAttested { get; set; }
        public int Compliant { get; set; }
        public ProfessionalDetailsReport Professional { get; set; }
        public List<PracticeReport> Practices { get; set; }
        public List<AffiliationReport> Affiliations { get; set; }
        public List<TypeTableBase> Certifications { get; set; }
        public List<TypeTableBase> Expertise { get; set; }
        public List<TypeTableBase> Languages { get; set; }
        public List<ProviderLicenseReport> Licenses { get; set; }
        public List<SpecializationReport> Specializations { get; set; }

    }
}
