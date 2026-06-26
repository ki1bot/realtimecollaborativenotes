export const getNoteRole = (note: any, userId: string) => {
  const id = String(userId);

  if (String(note.owner?._id || note.owner) === id) {
    return "owner";
  }

  const collaborator = note.collaborators.find((item: any) => {
    return String(item.user?._id || item.user) === id;
  });

  return collaborator ? collaborator.role : null;
};

export const canViewNote = (note: any, userId: string) => {
  return Boolean(getNoteRole(note, userId));
};

export const canEditNote = (note: any, userId: string) => {
  const role = getNoteRole(note, userId);
  return role === "owner" || role === "editor";
};

export const isOwner = (note: any, userId: string) => {
  return getNoteRole(note, userId) === "owner";
};
