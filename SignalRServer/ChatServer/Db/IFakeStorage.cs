using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Models;

namespace ChatServer.Db
{
    public interface IFakeStorage
    {
        List<Avatar> Avatars { get; set; }
        List<string> Rooms { get; set; }
        List<Message> Messages { get; set; }
    }
}
