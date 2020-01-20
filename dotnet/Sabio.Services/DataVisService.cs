using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Practices;
using Sabio.Models.Domain.Providers;
using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Sabio.Services
{
    public class DataVisService : IDataVisService
    {
        IDataProvider _data = null;
        public DataVisService(IDataProvider data)
        {
            _data = data;
        }

        public List<ProviderDataVis> GetProviderData()
        {
            string procName = "[dbo].[ProvidersReport_Select_DetailCounts]";
            List<ProviderDataVis> list = null;
            _data.ExecuteCmd(procName, null, (reader, set) =>
            {

                ProviderDataVis provider = HydrateProviderDataVis(reader);

                if (list == null)
                {
                    list = new List<ProviderDataVis>();
                }

                list.Add(provider);

            });
            return list;
        }

        public List<PracticeDataVis> GetPracticeData()
        {
            string procName = "[dbo].[Practices_Select_Counts]";
            List<PracticeDataVis> list = null;
            _data.ExecuteCmd(procName, null, (reader, set) =>
            {
                int index = 0;
                PracticeDataVis practice = new PracticeDataVis();
                practice.Id = reader.GetSafeInt32(index++);
                practice.Locations = reader.GetSafeJSON<List<TypeTableBase>>(index++);                

                if(list == null)
                {
                    list = new List<PracticeDataVis>();
                }

                list.Add(practice);

            });
            return list;
        }

        private ProviderDataVis HydrateProviderDataVis(IDataReader reader)
        {
            int index = 0;
            ProviderDataVis provider = new ProviderDataVis();

            provider.Id = reader.GetSafeInt32(index++);
            provider.Gender = reader.GetSafeString(index++);
            provider.DateAttested = reader.GetSafeDateTime(index++);
            provider.Compliant = reader.GetSafeInt32(index++);
            provider.Professional = reader.GetSafeJSON<ProfessionalDetailsReport>(index++);
            provider.Affiliations = reader.GetSafeJSON<List<AffiliationReport>>(index++);
            provider.Certifications = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            provider.Expertise = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            provider.Languages = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            provider.Licenses = reader.GetSafeJSON<List<ProviderLicenseReport>>(index++);
            provider.Specializations = reader.GetSafeJSON<List<SpecializationReport>>(index++);
            provider.InsurancePlans = reader.GetSafeJSON<List<TypeTableBase>>(index++);

            return provider;
        }



    }
}
