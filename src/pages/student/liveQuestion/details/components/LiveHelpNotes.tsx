interface LiveHelpNotesProps {
  liveHelp: any;
}

const LiveHelpNote = ({ liveHelp }: LiveHelpNotesProps) => {
  // Defensive: fallback to empty object if liveHelp is undefined
  const lh = liveHelp || {};
  const meta = lh.metadata || {};
  const notes: string[] = [];

  // Add session type note
  if (lh.sessionType) {
    notes.push(`This is a ${String(lh.sessionType).toLowerCase()} session.`);
  }
  // Add expertise level note
  if (lh.expertiseLevel) {
    notes.push(`Expertise level required: ${lh.expertiseLevel}.`);
  }
  // Add language note
  if (lh.language) {
    notes.push(`Session will be conducted in ${lh.language}.`);
  }
  // Add price per hour note
  if (lh.pricePerHour) {
    notes.push(`Price per hour: $${lh.pricePerHour}`);
  }
  // Add skills note
  if (Array.isArray(meta.skills) && meta.skills.length > 0) {
    notes.push(`Required skills: ${meta.skills.join(', ')}.`);
  }
  // Add university note
  if (meta.university) {
    notes.push(`University: ${meta.university}`);
  }
  // Add help type note
  if (meta.helpType) {
    notes.push(`Help Type: ${meta.helpType}`);
  }
  // Add additional services note
  if (meta.additionalServices) {
    notes.push(`Additional Services: ${meta.additionalServices}`);
  }
  // Add requirements note
  if (meta.requirements) {
    notes.push(`Requirements: ${meta.requirements}`);
  }
  // Add review note if present
  if (lh.review) {
    notes.push(`Review: ${lh.review}`);
  }
  // Add default note if no specific notes
  if (notes.length === 0) {
    notes.push('Please review the live help details before joining.');
    notes.push('Make sure you have all necessary materials ready.');
    notes.push('Contact support if you have any questions.');
  }

  return (
    <div className="p-5 bg-[#FFF1DC] rounded-lg">
      <div className="flex flex-col gap-2 items-start">
        <h4 className="text-[14px] font-poppinssemibold">Live Help Notes</h4>
        <ul className="flex flex-col gap-2 text-[12px] font-poppinsregular list-disc list-outside ml-4">
          {notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LiveHelpNote;
