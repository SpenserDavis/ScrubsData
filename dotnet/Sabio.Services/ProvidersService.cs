using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Providers;
using Sabio.Models.Domain.TypeTables;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Providers;
using Sabio.Services.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Sabio.Models.Domain.InsurancePlans;
using Sabio.Models.Requests.Locations;
using Sabio.Models.Requests.Practice;
using Sabio.Models.Requests.Files;

namespace Sabio.Services
{
    public class ProvidersService : IProvidersService
    {
        IDataProvider _data = null;

        public ProvidersService(IDataProvider data)
        {
            _data = data;
        }

        public MemoryStream ReportSelectAll(ProviderDetailCategories categories, int userId)
        {

            string procName;
            if (userId == 0)
            {
                procName = "[dbo].[ProvidersReport_SelectAll_Details]";
            }
            else
            {
                procName = "[dbo].[ProvidersReport_SelectAll_DetailsV2]";

            }

            List<ProviderReport> list = null;

            _data.ExecuteCmd(procName, paramCol =>
            {
                if (userId == 0)
                {
                    ModifyReportParams(paramCol, categories);
                }
                else
                {
                    ModifyReportParamsV2(paramCol, categories, userId);
                }
            }, (reader, set) =>
            {

                ProviderReport provider = HydrateProvidersReport(reader, out int lastIndex);

                if (list == null)
                {
                    list = new List<ProviderReport>();
                }

                list.Add(provider);

            });


            //this dict will keep track of the longest count across each category
            Dictionary<string, int> countDict = new Dictionary<string, int>();

            bool catIsSelected;

            //filter categories by truthy, and add an entries to the dictionary "countDict" 
            PropertyInfo[] truthyCategories = categories.GetType()
                .GetProperties()
                .Where(prop =>
                {
                    bool.TryParse(prop.GetValue(categories).ToString(), out catIsSelected);
                    return catIsSelected;
                }).ToArray();


            foreach (PropertyInfo propertyInfo in truthyCategories)
            {
                countDict.Add(propertyInfo.Name, 0);
            }


            //get all properties of type List that are truthy within categories, and store them in arrayProperties for future access
            Type type = typeof(ProviderReport);
            PropertyInfo[] allProperties = type.GetProperties();

            PropertyInfo[] arrayProperties = allProperties
                .Where(property => property.PropertyType.IsGenericType &&
                    countDict.ContainsKey(property.Name)).ToArray();


            //iterate over each provider and update counts in dict
            foreach (ProviderReport providerReport in list)
            {
                foreach (PropertyInfo property in arrayProperties)
                {
                    //nullcheck current prop
                    ICollection propCollection = GetPropValue<ICollection>(providerReport, property.Name);
                    if (propCollection != null)
                    {
                        //compare this particular instanced count to the count in the dict
                        if (countDict[property.Name] < propCollection.Count)
                        {
                            countDict[property.Name] = propCollection.Count;
                        }

                    }
                }
            }

            var stream = new MemoryStream();
            using (var package = new ExcelPackage(stream))
            {

                #region concatenated details worksheet
                //create new worksheet with base info
                ExcelWorksheet concatenated = package.Workbook.Worksheets.Add("Concatenated Details");

                ModifyBaseExcelHeaders(concatenated, out int concatenatedHeaderIndex);

                if (categories.Professional)
                {
                    concatenated.Cells[1, concatenatedHeaderIndex++].Value = "NPI";
                    concatenated.Cells[1, concatenatedHeaderIndex++].Value = "Genders Accepted";
                }


                //sort arrayProperties to ensure consistent excel column ordering between worksheets
                PropertyInfo[] sortedArrayProperties = arrayProperties.OrderBy(p => p.Name).ToArray();

                //add cell to worksheet with value of property name
                for (int i = 0; i < sortedArrayProperties.Length; i++)
                {
                    concatenated.Cells[1, concatenatedHeaderIndex++].Value = sortedArrayProperties[i].Name;
                }

                //call this before filling concatenated w/s         
                using (var r = concatenated.Cells[1, 1, 1, concatenatedHeaderIndex - 1])
                {
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                }


                //fill w/s with data
                int concatenatedRowIndex = 2;
                foreach (ProviderReport providerReport in list)
                {

                    PopulateBaseExcelCells(concatenated, providerReport, concatenatedRowIndex, out int concatenatedColIndex);

                    if (categories.Professional)
                    {
                        concatenated.Cells[concatenatedRowIndex, concatenatedColIndex].Value
                        = providerReport.Professional?.NPI;
                        concatenatedColIndex++;

                        if (providerReport.Professional?.GendersAccepted != null)
                        {
                            concatenated.Cells[concatenatedRowIndex, concatenatedColIndex].Value
                            = providerReport.Professional.GendersAccepted;
                        }
                        concatenatedColIndex++;
                    }

                    for (int i = 0; i < sortedArrayProperties.Length; i++)
                    {
                        ICollection propCollection = GetPropValue<ICollection>(providerReport, sortedArrayProperties[i].Name);

                        if (propCollection != null)
                        {
                            string concatProp = "";
                            foreach (var prop in propCollection)
                            {
                                if (concatProp != "")
                                {
                                    concatProp += $"; ";
                                }
                                string propName = "";

                                if (sortedArrayProperties[i].Name == "Licenses")
                                {
                                    propName = GetPropValue<string>(prop, "State");
                                }
                                else
                                {
                                    propName = GetPropValue<string>(prop, "Name");
                                }

                                concatProp += $"{propName}";
                            }
                            concatenated.Cells[concatenatedRowIndex, concatenatedColIndex++].Value
                            = concatProp;
                        }
                        else
                        {
                            concatenatedColIndex++;
                        }
                    }
                    concatenatedRowIndex++;
                }

                concatenated.Cells.AutoFitColumns(0, 30);


                #endregion


                #region expanded details worksheet
                ExcelWorksheet expanded = package.Workbook.Worksheets.Add("Expanded Details");

                ModifyBaseExcelHeaders(expanded, out int expandedHeaderIndex);

                if (categories.Professional)
                {
                    expanded.Cells[1, expandedHeaderIndex++].Value = "NPI";
                    expanded.Column(expandedHeaderIndex).Style.Numberformat.Format = "#";
                    expanded.Cells[1, expandedHeaderIndex++].Value = "Genders Accepted";
                }

                for (int i = 0; i < sortedArrayProperties.Length; i++)
                {
                    for (int j = 0; j < countDict[sortedArrayProperties[i].Name]; j++)
                    {
                        string truncatedName = sortedArrayProperties[i].Name.EndsWith("s")
                        ? sortedArrayProperties[i].Name.Substring(0, sortedArrayProperties[i].Name.Length - 1)
                        : sortedArrayProperties[i].Name;
                        expanded.Cells[1, expandedHeaderIndex++].Value = $"{truncatedName}{j + 1}";
                    }

                }


                using (var r = expanded.Cells[1, 1, 1, expandedHeaderIndex - 1])
                {
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                }


                //fill w/s with data
                int expandedRowIndex = 2;
                foreach (ProviderReport providerReport in list)
                {
                    PopulateBaseExcelCells(expanded, providerReport, expandedRowIndex, out int expandedColIndex);

                    if (categories.Professional)
                    {

                        expanded.Cells[concatenatedRowIndex, expandedColIndex].Value
                        = providerReport.Professional?.NPI;

                        expandedColIndex++;

                        if (providerReport.Professional?.GendersAccepted != null)
                        {
                            expanded.Cells[concatenatedRowIndex, expandedColIndex].Value
                            = providerReport.Professional.GendersAccepted;
                        }
                        expandedColIndex++;
                    }

                    for (int i = 0; i < sortedArrayProperties.Length; i++)
                    {
                        ICollection propCollection = GetPropValue<ICollection>(providerReport, sortedArrayProperties[i].Name);
                        int dictCount = countDict[sortedArrayProperties[i].Name];

                        if (propCollection != null)
                        {
                            foreach (var prop in propCollection)
                            {
                                string propName = "";

                                if (sortedArrayProperties[i].Name == "Licenses")
                                {
                                    propName = GetPropValue<string>(prop, "State");
                                }
                                else
                                {
                                    propName = GetPropValue<string>(prop, "Name");
                                }

                                expanded.Cells[expandedRowIndex, expandedColIndex++].Value = propName;
                            }
                            int propCount = propCollection.Count;

                            if (propCount < dictCount)
                            {
                                expandedColIndex += dictCount - propCount;
                            }
                        }
                        else
                        {
                            expandedColIndex += dictCount;
                        }
                    }
                    expandedRowIndex++;
                }

                expanded.Cells.AutoFitColumns(0, 40);

                #endregion


                #region individual detail worksheets

                Dictionary<string, ExcelWorksheet> worksheets = new Dictionary<string, ExcelWorksheet>();

                //creates appropriate worksheet detail names
                foreach (PropertyInfo propertyInfo in truthyCategories)
                {
                    string friendlyWsName = propertyInfo.Name.EndsWith("s")
                    ? propertyInfo.Name.Substring(0, propertyInfo.Name.Length - 1)
                    : propertyInfo.Name;
                    worksheets.Add(propertyInfo.Name, package.Workbook.Worksheets.Add(friendlyWsName + " Details"));
                }


                //populate all of the worksheets with shared headers
                foreach (var kvp in worksheets)
                {
                    //ExcelWorksheet sharedWs = GetPropValue<ExcelWorksheet>(worksheets, key);
                    ExcelWorksheet sharedWs = kvp.Value;

                    int sharedHeaderIndex = 1;
                    sharedWs.Cells[1, sharedHeaderIndex++].Value = "ID";
                    sharedWs.Cells[1, sharedHeaderIndex++].Value = "First Name";
                    sharedWs.Cells[1, sharedHeaderIndex++].Value = "Last Name";

                    if (kvp.Key == "Professional")
                    {
                        sharedWs.Cells[1, sharedHeaderIndex++].Value = "NPI";
                        sharedWs.Cells[1, sharedHeaderIndex++].Value = "Genders Accepted";

                    }
                    else
                    {
                        string truncatedName = kvp.Key.EndsWith("s")
                       ? kvp.Key.Substring(0, kvp.Key.Length - 1)
                       : kvp.Key;
                        sharedWs.Cells[1, sharedHeaderIndex++].Value = $"{truncatedName}";
                    }


                    using (var r = sharedWs.Cells[1, 1, 1, sharedHeaderIndex - 1])
                    {
                        r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    }

                    //add data to w/s
                    int sharedWsRowIndex = 2;
                    foreach (ProviderReport providerReport in list)
                    {
                        if (kvp.Key == "Professional")
                        {
                            PopulateSharedBaseExcelCells(sharedWs, providerReport, sharedWsRowIndex, out int sharedColIndex);


                            sharedWs.Cells[sharedWsRowIndex, sharedColIndex].Value = providerReport.Professional?.NPI;
                            sharedColIndex++;

                            if (providerReport.Professional?.GendersAccepted != null)
                            {
                                sharedWs.Cells[sharedWsRowIndex, sharedColIndex].Value = providerReport.Professional.GendersAccepted;
                            }
                            sharedColIndex++;

                            sharedWsRowIndex++;
                        }
                        else
                        {
                            IList prop = GetPropValue<IList>(providerReport, kvp.Key);
                            if (prop != null)
                            {
                                for (int i = 0; i < prop.Count; i++)
                                {

                                    PopulateSharedBaseExcelCells(sharedWs, providerReport, sharedWsRowIndex, out int sharedColIndex);

                                    if (kvp.Key == "Licenses")
                                    {
                                        sharedWs.Cells[sharedWsRowIndex, sharedColIndex++].Value = GetPropValue<string>(prop[i], "State");

                                    }
                                    else
                                    {
                                        sharedWs.Cells[sharedWsRowIndex, sharedColIndex++].Value = GetPropValue<string>(prop[i], "Name");

                                        if (kvp.Key == "Specializations")
                                        {
                                            bool isPrimarySpec = GetStructValue<bool>(prop[i], "IsPrimary");

                                            if (isPrimarySpec)
                                            {
                                                sharedWs.Cells[sharedWsRowIndex, sharedColIndex - 1].Style.Font.Bold = true;
                                            }
                                        }
                                    }
                                    sharedWsRowIndex++;
                                }
                            }
                        }
                    }
                    sharedWs.Cells.AutoFitColumns(0);
                }

                #endregion


                // set some document properties
                package.Workbook.Properties.Title = "Providers Report";
                package.Workbook.Properties.Author = "Scrubs Data";

                // save new workbook in the output directory 
                package.Save();

            }
            return stream;

        }

        public Paged<Provider> SelectByExpertise(int expertiseId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Providers_Select_byExpertise]";

            List<Provider> list = null;
            Paged<Provider> pagedItems = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, paramCol =>
            {
                paramCol.AddWithValue("@pageIndex", pageIndex);
                paramCol.AddWithValue("@pageSize", pageSize);
                paramCol.AddWithValue("@expertiseId", expertiseId);
            }, (reader, set) =>
            {
                Provider provider = HydrateProviderDetails(reader, out int lastIndex);

                if (list == null)
                {
                    list = new List<Provider>();
                }

                list.Add(provider);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(lastIndex);
                }

            });

            if (list != null)
            {
                pagedItems = new Paged<Provider>(list, pageIndex, pageSize, totalCount);
            }

            return pagedItems;

        }


        private static T HydrateProvider<T>(IDataReader reader, out int index) where T : ProviderBase, new()
        {
            T provider = new T();
            index = 0;
            provider.Id = reader.GetSafeInt32(index++);
            provider.TitleTypeId = reader.GetSafeInt32(index++);
            provider.UserProfileId = reader.GetSafeInt32(index++);
            provider.GenderTypeId = reader.GetSafeInt32(index++);
            provider.Phone = reader.GetSafeString(index++);
            provider.Fax = reader.GetSafeString(index++);
            provider.CreatedBy = reader.GetSafeInt32(index++);
            provider.ModifiedBy = reader.GetSafeInt32(index++);
            provider.DateCreated = reader.GetSafeDateTime(index++);
            provider.DateModified = reader.GetSafeDateTime(index++);

            //if any provider procs are modified, the index might not like that

            return provider;

        }


        private static ProviderReport HydrateProvidersReport(IDataReader reader, out int index)
        {
            ProviderReport providerReport = new ProviderReport();
            index = 0;
            providerReport.Id = reader.GetSafeInt32(index++);
            providerReport.Title = reader.GetSafeString(index++);
            providerReport.FirstName = reader.GetSafeString(index++);
            providerReport.Mi = reader.GetSafeString(index++);
            providerReport.LastName = reader.GetSafeString(index++);
            providerReport.Gender = reader.GetSafeString(index++);
            providerReport.Phone = reader.GetSafeString(index++);
            providerReport.Fax = reader.GetSafeString(index++);
            providerReport.Email = reader.GetSafeString(index++);
            providerReport.UserId = reader.GetSafeInt32(index++);
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



        private static Provider HydrateProviderDetails(IDataReader reader, out int detailsIndex)
        {

            Provider provider = HydrateProvider<Provider>(reader, out int index);
            detailsIndex = index;
            provider.UserProfile = reader.GetSafeJSON<UserProfile>(detailsIndex++);
            provider.ProfessionalDetails = reader.GetSafeJSON<ProfessionalDetails>(detailsIndex++);
            provider.Practices = reader.GetSafeJSON<List<Practice>>(detailsIndex++);
            provider.Affiliations = reader.GetSafeJSON<List<Affiliation>>(detailsIndex++);
            provider.Certifications = reader.GetSafeJSON<List<Certification>>(detailsIndex++);
            provider.Expertise = reader.GetSafeJSON<List<Expertise>>(detailsIndex++);
            provider.Languages = reader.GetSafeJSON<List<Language>>(detailsIndex++);
            provider.Licenses = reader.GetSafeJSON<List<ProviderLicense>>(detailsIndex++);
            provider.Specializations = reader.GetSafeJSON<List<Specialization>>(detailsIndex++);
            return provider;
        }

        private static void ModifyInsertParams(SqlParameterCollection paramCol, ProviderAddRequest provider)
        {
            paramCol.AddWithValue("@TitleTypeId", provider.TitleTypeId);
            paramCol.AddWithValue("@GenderTypeId", provider.GenderTypeId);
            paramCol.AddWithValue("@Phone", provider.Phone);
            paramCol.AddWithValue("@Fax", provider.Fax);
            paramCol.AddWithValue("@FirstName", provider.UserProfile.FirstName);
            paramCol.AddWithValue("@LastName", provider.UserProfile.LastName);
            paramCol.AddWithValue("@Mi", provider.UserProfile.Mi);
            paramCol.AddWithValue("@AvatarUrl", provider.UserProfile.AvatarUrl);
            paramCol.AddWithValue("@NPI", provider.ProfessionalDetails.NPI);
            paramCol.AddWithValue("@GenderAccepted", provider.ProfessionalDetails.GenderAccepted);
            paramCol.AddWithValue("@Email", provider.User.Email);

        }

        private static void ModifyReportParams(SqlParameterCollection paramCol, ProviderDetailCategories categories)
        {
            paramCol.AddWithValue("@affiliations", categories.Affiliations);
            paramCol.AddWithValue("@certifications", categories.Certifications);
            paramCol.AddWithValue("@expertise", categories.Expertise);
            paramCol.AddWithValue("@languages", categories.Languages);
            paramCol.AddWithValue("@licenses", categories.Licenses);
            paramCol.AddWithValue("@practices", categories.Practices);
            paramCol.AddWithValue("@professionalDetails", categories.Professional);
            paramCol.AddWithValue("@specializations", categories.Specializations);
        }

        //redacted

        private static void ModifyBaseExcelHeaders(ExcelWorksheet worksheet, out int index)
        {
            index = 1;
            worksheet.Cells[1, index++].Value = "ID";
            worksheet.Cells[1, index++].Value = "Title";
            worksheet.Cells[1, index++].Value = "First Name";
            worksheet.Cells[1, index++].Value = "M.I.";
            worksheet.Cells[1, index++].Value = "Last Name";
            worksheet.Cells[1, index++].Value = "Gender";
            worksheet.Cells[1, index++].Value = "Phone";
            worksheet.Cells[1, index++].Value = "Fax";
            worksheet.Cells[1, index++].Value = "Email";
            worksheet.Cells[1, index++].Value = "Date Attested";
            worksheet.Column(index - 1).Style.Numberformat.Format = "dd-MM-yyyy";
            worksheet.Cells[1, index++].Value = "Compliant?";
        }

        private static void PopulateBaseExcelCells(ExcelWorksheet worksheet, ProviderReport providerReport, int rowIndex, out int colIndex)
        {
            colIndex = 1;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Id;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Title;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.FirstName;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Mi;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.LastName;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Gender;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Phone;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Fax;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Email;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.DateAttested;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Compliant == 1 ? "Compliant" : "Noncompliant";
        }

        private static void PopulateSharedBaseExcelCells(ExcelWorksheet worksheet, ProviderReport providerReport, int rowIndex, out int colIndex)
        {
            colIndex = 1;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.Id;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.FirstName;
            worksheet.Cells[rowIndex, colIndex++].Value = providerReport.LastName;
        }

        private static Object GetPropValue(Object obj, String name)
        {
            foreach (String part in name.Split('.'))
            {
                if (obj == null) { return null; }

                Type type = obj.GetType();
                PropertyInfo info = type.GetProperty(part);
                if (info == null) { return null; }

                obj = info.GetValue(obj, null);
            }
            return obj;
        }

        public static T GetPropValue<T>(Object obj, String name) where T : class
        {
            Object retVal = GetPropValue(obj, name);
            if (retVal == null) { return default(T); }

            //brings retVal back as null if type conversion is impossible
            //reference types can be null
            //"as" operator yields null upon unsucessful conversion
            return retVal as T;
        }

        public static T GetStructValue<T>(Object obj, String name) where T : struct
        {
            Object retVal = GetPropValue(obj, name);
            if (retVal == null) { return default(T); }

            // throws InvalidCastException if types are incompatible
            //value types can't be null
            return (T)retVal;
        }

    }
}
