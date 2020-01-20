using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderDataVis
    {
        public int Id { get; set; }
        public string Gender { get; set; }
        public DateTime DateAttested { get; set; }
        public int Compliant { get; set; }
        public ProfessionalDetails ProfessionalDetails { get; set; }
        public ProfessionalDetailsReport Professional { get; set; }      
        public List<AffiliationReport> Affiliations { get; set; }
        public List<TypeTableBase> Certifications { get; set; }
        public List<TypeTableBase> Expertise { get; set; }
        public List<TypeTableBase> Languages { get; set; }
        public List<ProviderLicenseReport> Licenses { get; set; }
        public List<SpecializationReport> Specializations { get; set; }
        public List<TypeTableBase> InsurancePlans { get; set; }

    }
}
