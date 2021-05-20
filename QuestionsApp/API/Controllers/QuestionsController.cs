using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly DataContext _context;
        public QuestionsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questions>>> GetQuestions() {
            return await _context.Questions.ToListAsync();
        }

        [HttpGet("{id}", Name = "GetQuestion")]
        public async Task<ActionResult<Questions>> GetQuestion(int id) {
            return await _context.Questions.FindAsync(id);
        }

        [HttpPost()]
        public async Task<ActionResult<Questions>> CreateQuestion(Questions question) {
            await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetQuestion", new { id = question.Id.ToString() }, question);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Questions>> DeleteQuestion(int id) {
            var question = await _context.Questions.FindAsync(id);
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return question;
        }

        [HttpPut]
        public async Task<ActionResult<Questions>> UpdateQuestion(Questions question) {
            _context.Questions.Update(question);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetQuestion", new { id = question.Id.ToString() }, question);
        }
    }
}