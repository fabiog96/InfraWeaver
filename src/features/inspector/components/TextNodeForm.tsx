import type { TextNodeData } from "@/shared/types";
import { useDiagramStore } from "@/stores"
import { useCallback } from "react";
import { useShallow } from 'zustand/react/shallow';   

const fontSizeOptions =[
    {value: 'sm', label: "Small"},
    {value: 'md', label: "Medium"},
    {value: 'lg', label: "Large"},
]

export const TextNodeForm = () =>{
    const {selectedNodeId, nodes, updateNodeData} = useDiagramStore(
        useShallow((s)=>({
            selectedNodeId: s.selectedNodeId,
            nodes: s.nodes,
            updateNodeData: s.updateNodeData
        })),
    );

    const node = nodes.find(n=>n.id === selectedNodeId);
    if(!node || node.type !== 'text') return null;

    const data = node.data as TextNodeData;

    const handleChange = useCallback(                   
      (field: keyof TextNodeData, value: unknown) => {
        if (!selectedNodeId) return;                                                                                                                                                                                                                 
        updateNodeData(selectedNodeId, { [field]: value });
      },                                                                                                                                                                                                                                             
      [selectedNodeId, updateNodeData],                 
    );

    return(
         <div className="flex flex-col gap-3 p-3">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground">Text Node</h3>                                                                                                                                                         
                                                                                                                                                                                                                                                     
        <label className="flex flex-col gap-1">                                                                                                                                                                                                      
          <span className="text-xs text-muted-foreground">Content</span>                                                                                                                                                                             
          <textarea                                                                                                                                                                                                                                  
            className="min-h-[100px] rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            value={data.content}                                                                                                                                                                                                                     
            onChange={(e) => handleChange('content', e.target.value)}
          />                                                                                                                                                                                                                                         
        </label>                                        
                                                                                                                                                                                                                                                     
        <label className="flex flex-col gap-1">         
          <span className="text-xs text-muted-foreground">Font Size</span>
          <select
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
            value={data.fontSize}                                                                                                                                                                                                                    
            onChange={(e) => handleChange('fontSize', e.target.value)}
          >                                                                                                                                                                                                                                          
            {fontSizeOptions.map((opt) => (             
              <option key={opt.value} value={opt.value}>{opt.label}</option>                                                                                                                                                                         
            ))}
          </select>                                                                                                                                                                                                                                  
        </label>                                        

        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Background Color</span>
          <input                                                                                                                                                                                                                                     
            type="color"
            className="h-8 w-full cursor-pointer rounded-md border border-border"                                                                                                                                                                    
            value={data.bgColor}                                                                                                                                                                                                                     
            onChange={(e) => handleChange('bgColor', e.target.value)}
          />                                                                                                                                                                                                                                         
        </label>                                        
      </div>
    )

}