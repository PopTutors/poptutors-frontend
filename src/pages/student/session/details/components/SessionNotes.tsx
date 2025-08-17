interface SessionData {
  _id: string;
  topic: string;
  subject: string;
  startTime: string;
  endTime: string;
  timezone: string;
  sessionType: string;
  expertiseLevel: string;
  language: string;
  skillsRequired: string[];
  budget: number;
  isNegotiable: boolean;
  requestedBy: {
    _id: string;
    name: string;
    email: string;
  };
  attendees: any[];
  documents: any[];
  createdAt: string;
  updatedAt: string;
  universityName: string;
  sessionAgenda: string;
  additionalServices?: string;
  requirements?: string;
  review?: string;
}

interface SessionNotesProps {
  session: SessionData;
}

const SessionNotes = ({ session }: SessionNotesProps) => {
  // Generate notes based on session data
  const generateNotes = () => {
    const notes = [];

    // Add session type note
    if (session.sessionType) {
      notes.push(`This is a ${session.sessionType.toLowerCase()} session.`);
    }

    // Add expertise level note
    if (session.expertiseLevel) {
      notes.push(`Expertise level required: ${session.expertiseLevel}.`);
    }

    // Add language note
    if (session.language) {
      notes.push(`Session will be conducted in ${session.language}.`);
    }

    // Add budget note
    if (session.budget) {
      const budgetText = session.isNegotiable
        ? `Budget: $${session.budget} (negotiable)`
        : `Budget: $${session.budget}`;
      notes.push(budgetText);
    }

    // Add skills note
    if (session.skillsRequired && session.skillsRequired.length > 0) {
      const skillsText = `Required skills: ${session.skillsRequired.join(', ')}.`;
      notes.push(skillsText);
    }

    // Add timezone note
    if (session.timezone) {
      notes.push(`All times are in ${session.timezone} timezone.`);
    }

    // Add university, agenda, additional services, requirements
    if (session.universityName) {
      notes.push(`University: ${session.universityName}`);
    }
    if (session.sessionAgenda) {
      notes.push(`Session Agenda: ${session.sessionAgenda}`);
    }
    if (session.additionalServices) {
      notes.push(`Additional Services: ${session.additionalServices}`);
    }
    if (session.requirements) {
      notes.push(`Requirements: ${session.requirements}`);
    }
    // Add review note if present
    if (session.review) {
      notes.push(`Review: ${session.review}`);
    }
    // Add default note if no specific notes
    if (notes.length === 0) {
      notes.push('Please review the session details before joining.');
      notes.push('Make sure you have all necessary materials ready.');
      notes.push('Contact support if you have any questions.');
    }

    return notes;
  };

  const notes = generateNotes();

  return (
    <div className="p-5 bg-[#FFF1DC] rounded-lg">
      <div className="flex flex-col gap-2 items-start">
        <h4 className="text-[14px] font-poppinssemibold">Session Notes</h4>
        <ul className="flex flex-col gap-2 text-[12px] font-poppinsregular list-disc list-outside ml-4">
          {notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SessionNotes;
