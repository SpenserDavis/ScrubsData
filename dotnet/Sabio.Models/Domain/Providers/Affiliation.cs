﻿using Sabio.Models.Domain.TypeTables;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain.Providers
{
    public class Affiliation : TypeTableBase
    {
        public TypeTableBase AffiliationType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }    
    }
}
