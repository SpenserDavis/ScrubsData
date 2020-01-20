using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Services
{
    public class TypeTablesService : ITypeTablesService
    {

        IDataProvider _data = null;

        public TypeTablesService(IDataProvider data)
        {
            _data = data;
        }

        public List<Object> SelectAll(string table)
        {
            string procName = null;

            switch (table)
            {
                case "affiliations":
                    procName = "[dbo].[AffiliationTypes_SelectAll]";
                    break;
                case "expertise":
                    procName = "[dbo].[ExpertiseTypes_SelectAll]";
                    break;
                case "facilities":
                    procName = "[dbo].[FacilityTypes_SelectAll]";
                    break;
                case "files":
                    procName = "[dbo].[FileTypes_SelectAll]";
                    break;
                case "genders":
                    procName = "[dbo].[GenderTypes_SelectAll]";
                    break;
                case "insurances":
                    procName = "[dbo].[InsuranceTypes_SelectAll]";
                    break;
                case "locations":
                    procName = "[dbo].[LocationTypes_SelectAll]";
                    break;
                case "questions":
                    procName = "[dbo].[QuestionTypes_SelectAll]";
                    break;
                case "surveys":
                    procName = "[dbo].[SurveyTypes_SelectAll]";
                    break;
                case "titles":
                    procName = "[dbo].[TitleTypes_SelectAll]";
                    break;
                case "tokens":
                    procName = "[dbo].[TokenTypes_SelectAll]";
                    break;
                case "urls":
                    procName = "[dbo].[UrlTypes_SelectAll]";
                    break;
            }

            List<Object> list = null;
            Object typeTable = null;

            _data.ExecuteCmd(procName, null, (reader, set) =>
            {

                if (table == "facilities")
                {
                    typeTable = HydrateTable<TypeTableDetails>(reader, table);
                }
                else
                {
                    typeTable = HydrateTable<TypeTableBase>(reader, table);
                }

                if (list == null)
                {
                    list = new List<Object>();
                }

                list.Add(typeTable);
            });

            return list;
        }

        private static T HydrateTable<T>(System.Data.IDataReader reader, string table) where T : TypeTableBase, new()
        {
            int index = 0;
            T typeTable = new T();
            typeTable.Id = reader.GetSafeInt32(index++);
            typeTable.Name = reader.GetSafeString(index++);
            if (reader.FieldCount == 3)
            {
                TypeTableDetails n = typeTable as TypeTableDetails;
                if (n != null)
                {
                    n.Description = reader.GetSafeString(index++);
                }
            }
            return typeTable;
        }
    }
}