using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Models
{
    public class Message
    {
        public string id { get; set; }
        public string room_id { get; set; }
        public string from { get; set; }
        public string photo { get; set; }
        public string date_utc_string { get; set; }
        public string time { get; set; }
        public string text { get; set; }
        public string attach { get; set; }
    }
}
