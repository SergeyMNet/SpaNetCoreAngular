using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatServer.Db;
using ChatServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ChatServer.Controllers
{
    [Produces("application/json")]
    [Route("api/storage")]
    public class StorageController : Controller
    {
        // GET api/storage/all
        [HttpGet("all")]
        public object GetAllData()
        {
            return new {
                avatars = FakeStorage.Avatars,
                rooms = FakeStorage.Rooms,
                messages = FakeStorage.Messages
            };
        }

        // GET api/storage/avatars
        [HttpGet("avatars")]
        public List<Avatar> GetAvatars()
        {
            return FakeStorage.Avatars;
        }

        // GET api/storage/rooms
        [HttpGet("rooms")]
        public List<string> GetRooms()
        {
            return FakeStorage.Rooms;
        }

        // GET api/storage/messages
        [HttpGet("messages")]
        public List<Message> GetMessages()
        {
            return FakeStorage.Messages;
        }
    }
}