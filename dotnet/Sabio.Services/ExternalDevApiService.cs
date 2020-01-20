using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Providers;
using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Sabio.Services
{
    public class ExternalDevApiService : IExternalDevApiService
    {
        IDataProvider _data = null;
        public ExternalDevApiService(IDataProvider data)
        {
            _data = data;
        }
        public List<ProviderReport> GetProvidersByAffiliation(string apiKey, string affiliation)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byAffiliation]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@affiliation", affiliation);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetAllProviderDetails(string apiKey)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_SelectAll_Details]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
             {
                 paramCol.AddWithValue("@apiKey", apiKey);
             }, (reader, set) =>
             {
                 ProviderReport providerReport = HydrateProvidersReport(reader);

                 if (list == null)
                 {
                     list = new List<ProviderReport>();
                 }

                 list.Add(providerReport);

             });

            return list;

        }
        public List<ProviderReport> GetProvidersByCertification(string apiKey, string certification)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byCertification]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@certification", certification);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersByExpertise(string apiKey, string expertise)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byExpertise]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@expertise", expertise);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersById(string apiKey, int id)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byId]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@id", id);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersByInsurancePlan(string apiKey, string insurancePlan)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byInsurancePlan]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@insurancePlan", insurancePlan);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersByLanguage(string apiKey, string language)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byLanguage]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@language", language);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersBySpecialization(string apiKey, string specialization)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_bySpecialization]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@specialization", specialization);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> GetProvidersByState(string apiKey, string state)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Select_byState]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@state", state);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        public List<ProviderReport> SearchProvidersByName(string apiKey, string query)
        {
            string procName = "[dbo].[ProvidersReport_ExtDev_Search_byName]";

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@apiKey", apiKey);
                paramCol.AddWithValue("@search", query);
            }, (reader, set) =>
            {
                ProviderReport providerReport = HydrateProvidersReport(reader);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(providerReport);

            });

            return list;

        }
        private ProviderReport HydrateProvidersReport(IDataReader reader)
        {
            ProviderReport providerReport = new ProviderReport();
            int index = 0;
            providerReport.Id = reader.GetSafeInt32(index++);
            providerReport.Title = reader.GetSafeString(index++);
            providerReport.FirstName = reader.GetSafeString(index++);
            providerReport.Mi = reader.GetSafeString(index++);
            providerReport.LastName = reader.GetSafeString(index++);
            providerReport.Gender = reader.GetSafeString(index++);
            providerReport.Phone = reader.GetSafeString(index++);
            providerReport.Fax = reader.GetSafeString(index++);
            providerReport.Email = reader.GetSafeString(index++);
            providerReport.DateAttested = reader.GetSafeDateTime(index++);
            providerReport.Compliant = reader.GetSafeInt32(index++);
            //refactor this code with hydrateproviderdetails after hector gives guidance
            providerReport.Professional = reader.GetSafeJSON<ProfessionalDetailsReport>(index++);
            providerReport.Practices = reader.GetSafeJSON<List<PracticeReport>>(index++);
            providerReport.Affiliations = reader.GetSafeJSON<List<AffiliationReport>>(index++);
            providerReport.Certifications = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            providerReport.Expertise = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            providerReport.Languages = reader.GetSafeJSON<List<TypeTableBase>>(index++);
            providerReport.Licenses = reader.GetSafeJSON<List<ProviderLicenseReport>>(index++);
            providerReport.Specializations = reader.GetSafeJSON<List<SpecializationReport>>(index++);

            return providerReport;
        }

    }
}
