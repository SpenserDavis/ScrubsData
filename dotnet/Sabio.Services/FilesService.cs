using Amazon.S3;
using Amazon;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Files;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Sabio.Services
{
    public class FilesService : IFilesService
    {
        IDataProvider _data = null;
        AwsCredential _aws = null;

        public FilesService(IDataProvider data, IOptions<AwsCredential> aws)
        {
            _data = data;
            _aws = aws.Value;
        }

        //redacted

        public string UploadV2(byte[] file)
        {
            string url = string.Empty;

            try
            {
                RegionEndpoint regionEndpoint = RegionEndpoint.GetBySystemName(_aws.BucketRegion);

                using (var client = new AmazonS3Client(_aws.AccessKey, _aws.Secret, regionEndpoint))
                {

                    string keyName = "scrubs_" + Guid.NewGuid() + "_chatUrl";
                    TransferUtility transferUtility = new TransferUtility(client);

                    using (var stream = new System.IO.MemoryStream(file))
                    {
                        transferUtility.Upload(stream, _aws.BucketName, keyName);
                    }

                    url = _aws.Domain + keyName;
                }
            }
            catch (AmazonS3Exception ex)
            {
                throw ex;
            }

            return url;
        }

        public List<string> UploadMultipleV2(List<string> collection)
        {
            List<string> urls = new List<string>();

            try
            {
                foreach (string file in collection)
                {
                    if (file != null)
                    {
                        byte[] data = Convert.FromBase64String(file);
                        string uploadResponse = UploadV2(data);
                        urls.Add(uploadResponse);
                    }
                }
            }
            catch (AmazonS3Exception ex)
            {
                throw ex;
            }

            return urls;
        }
    }
}
