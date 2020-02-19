using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile ()
        {
            CreateMap<Activity, ActivityDto> ();

            //for what we want to map to (Dto)'s props, specifiy where the prop from UA should be grabbed from
            CreateMap<UserActivity, AttendeeDto> ()
                .ForMember (dto => dto.Username, opt => opt.MapFrom (ua => ua.AppUser.UserName))
                .ForMember (dto => dto.DisplayName, opt => opt.MapFrom (ua => ua.AppUser.DisplayName))
                .ForMember(dto => dto.Image, o => o.MapFrom(ua => ua.AppUser.Photos.FirstOrDefault(p => p.IsMain).URL ));
        }
    }
}