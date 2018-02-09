using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Models;

namespace ChatServer.Db
{
    public static class FakeStorage
    {
        public static List<Avatar> Avatars = new List<Avatar>();
        public static List<string> Rooms = new List<string>();
        public static List<Message> Messages = new List<Message>();
    }
}
