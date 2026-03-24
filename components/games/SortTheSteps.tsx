/* eslint-disable */
"use client";

import React, { useState, useEffect } from "react";
import type { SortStepContent } from "@/lib/gameData";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortTheStepsProps {
  data: SortStepContent[];
  onComplete?: (score: number) => void;
}

function SortableItem({ id, item, index, isCorrect }: { id: string, item: SortStepContent, index: number, isCorrect: boolean | null }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isCorrect && { borderColor: 'var(--success)' })
  };

  const draggingClass = isDragging ? 'sort-item-dragging' : '';
  const correctClass = isCorrect ? 'success' : '';

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`sort-item card ${draggingClass} ${correctClass}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="drag-handle"
      >
        ⠿
      </div>
      <div className="item-number">{index + 1}</div>
      <div className="item-text">{item.text}</div>
    </div>
  );
}

export default function SortTheSteps({ data, onComplete }: SortTheStepsProps) {
  const [items, setItems] = useState<SortStepContent[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Shuffle on mount
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setIsCorrect(null);

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);

        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  };

  const checkOrder = () => {
    const isSorted = items.every((item, index) => item.order === index + 1);
    setIsCorrect(isSorted);
    if (isSorted && onComplete) {
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    }
  };

  return (
    <div className="sort-container">
      <div className="instructions">
        <h3>Arrange the Steps</h3>
        <p>Drag and drop to order the algorithm correctly from top to bottom.</p>
      </div>

      <div className="sort-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableItem 
                key={item.id} 
                id={item.id} 
                item={item} 
                index={index} 
                isCorrect={isCorrect} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="actions" style={{ marginTop: '2rem' }}>
        <button 
          className={"btn-primary " + (isCorrect ? 'btn-success' : '') + (isCorrect === false ? ' btn-error' : '')}
          onClick={checkOrder}
          disabled={isCorrect === true}
        >
          {isCorrect === null && "Check Order"}
          {isCorrect === true && "Correct! Great Job 🎉"}
          {isCorrect === false && "Incorrect, try again"}
        </button>
      </div>
    </div>
  );
}
