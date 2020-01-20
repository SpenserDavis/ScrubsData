using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class ProviderSpecialization
    {
        public int ProviderId { get; set; }
        public int SpecializationId { get; set; }
        public bool IsPrimary { get; set; }
        public int CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
