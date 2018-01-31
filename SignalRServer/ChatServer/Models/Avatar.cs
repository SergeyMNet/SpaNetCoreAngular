using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Models
{
    public class Avatar
    {
        public string id { get; set; }
        public string uid { get; set; }
        public string name { get; set; }
        public string img { get; set; }
        public long create_date { get; set; }
        public string sel_room { get; set; }
    }
}
