using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Models
{
    public class Avatar
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string UserImage { get; set; }
        public int CreateDate { get; set; }
        public string SelectedRoom { get; set; }
        


    //id: string;
    //uid: string;
    //name: string;
    //img: string;
    //create_date: number;
    //sel_room = '/chat_rooms/main';
    //rooms: Room[] = [];
    }
}
