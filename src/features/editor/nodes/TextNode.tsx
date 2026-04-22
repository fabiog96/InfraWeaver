import {memo, useState, useCallback, useRef, useEffect} from 'react'
import { NodeResizer, type NodeProps } from '@xyflow/react'

import type {TextNode as TextNodeFlow  } from '@/shared/types'
import { useDiagramStore } from '@/stores'

const fontSizeMap = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg'
} as const

export const TextNode = memo(({id, data, selected}: NodeProps<TextNodeFlow>) =>{
const [editing, setEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);                                                                                                                                                                                           
                                                        
    const handleDoubleClick = useCallback(() => {                                                                                                                                                                                                    
      setEditing(true);
    }, []);                                                                                                                                                                                                                                          
                                                        
    const handleBlur = useCallback(() => {
      setEditing(false);
    }, []);

    // Auto-focus textarea when entering edit mode                                                                                                                                                                                                   
    useEffect(() => {
      if (editing && textareaRef.current) {                                                                                                                                                                                                          
        textareaRef.current.focus();                    
        textareaRef.current.selectionStart = textareaRef.current.value.length;
      }                                                                                                                                                                                                                                              
    }, [editing]);
                                                                                                                                                                                                                                                                   

    return (
      <div
        className={`h-full w-full rounded-md border p-3 ${                                                                                                                                                                                           
          selected ? 'border-primary/60' : 'border-border'
        }`}                                                                                                                                                                                                                                          
        style={{ backgroundColor: data.bgColor + '18' }}
        onDoubleClick={handleDoubleClick}                                                                                                                                                                                                            
      >                                                                                                                                                                                                                                              
        <NodeResizer
          isVisible={selected}                                                                                                                                                                                                                       
          minWidth={150}                                
          minHeight={80}                                                                                                                                                                                                                             
          lineClassName="!border-primary/30"
          handleClassName="!h-2 !w-2 !rounded-sm !border-primary/50 !bg-background"                                                                                                                                                                  
        />                                                                                                                                                                                                                                           
  
        {editing ? (                                                                                                                                                                                                                                 
          <textarea                                     
            ref={textareaRef}
            className={`h-full w-full resize-none bg-transparent outline-none ${fontSizeMap[data.fontSize]}`}
            value={data.content}                                                                                                                                                                                                                 
            onChange={(e) => {
                useDiagramStore.getState().updateNodeData(id, {content: e.target.value})                                                                                                                                                            
            }}                                                                                                                                                                                                                                       
            onBlur={handleBlur}
            onKeyDown={(e) => {                                                                                                                                                                                                                      
              if (e.key === 'Escape') handleBlur();     
            }}                                                                                                                                                                                                                                       
          />
        ) : (                                                                                                                                                                                                                                        
          <div className={`h-full w-full whitespace-pre-wrap ${fontSizeMap[data.fontSize]}`}>
            {data.content || 'Double-click to edit...'}
          </div>                                                                                                                                                                                                                                     
        )}
      </div>             
    )
})

TextNode.displayName = 'TextNode';                                                                                                                                                                                                                 