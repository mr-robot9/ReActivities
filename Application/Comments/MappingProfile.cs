using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile //automapper
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDTO>()
                .ForMember(dto => dto.Username, opt => opt.MapFrom(com => com.Author.UserName))
                .ForMember(dto => dto.DisplayName, opt => opt.MapFrom(com => com.Author.DisplayName))
                .ForMember(dto => dto.Image, opt => opt.MapFrom(com => com.Author.Photos.FirstOrDefault(x => x.IsMain).URL));
                
        }
    }
}