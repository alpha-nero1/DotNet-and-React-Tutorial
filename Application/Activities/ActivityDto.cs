using System;
using System.Collections.Generic;
using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }

        // [Required] - to make the model field required (field annotation)
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }

        public string HostUsername { get; set; }

        public bool IsCancelled { get; set; }

        // Will set a default array and avoids null reference, cannot add anything to null.
        public ICollection<AttendeeDto> Attendees { get; set; }
    }
}