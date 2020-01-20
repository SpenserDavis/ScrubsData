using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;

namespace Sabio.Data
{
    public static class IDataReaderExt
    {
        #region Safe Reference Type Mappers      

        //redacted

        public static T GetSafeJSON<T>(this IDataReader reader, Int32 ordinal)
        {

            string potentialJSON = reader.GetSafeString(ordinal);
            if (!string.IsNullOrEmpty(potentialJSON))
            {
                return JsonConvert.DeserializeObject<T>(potentialJSON, _settings);
            }
            return default(T);
        }


        #endregion Safe Reference Type Mappers

        //redacted

    }
}