import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import type { Question } from '../../types';
import QuestionEditor from './QuestionEditor';

interface DraggableQuestionListProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
  onUpdate: (q: Question) => void;
  onDelete: (id: string) => void;
}

const DraggableQuestionList: React.FC<DraggableQuestionListProps> = ({ questions, onChange, onUpdate, onDelete }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(questions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onChange(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions-droppable">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {questions.map((q, idx) => (
              <Draggable key={q.id} draggableId={q.id} index={idx}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ mb: 3, opacity: snapshot.isDragging ? 0.7 : 1 }}
                  >
                    <QuestionEditor
                      question={q}
                      onChange={onUpdate}
                      onDelete={() => onDelete(q.id)}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableQuestionList;
