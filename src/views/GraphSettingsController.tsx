import { useSetSettings, useSigma } from "@react-sigma/core";
import { Attributes } from "graphology-types";
import { FC, PropsWithChildren, useEffect } from "react";

import { drawHover, drawLabel } from "../canvas-utils";
import { IS_MOBILE } from "../is-mobile";
import useDebounce from "../use-debounce";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";
const EDGE_SIZE_HIGHLIGHT = 4;

const GraphSettingsController: FC<PropsWithChildren<{ hoveredNode: string | null }>> = ({ children, hoveredNode }) => {
  const sigma = useSigma();
  const setSettings = useSetSettings();
  const graph = sigma.getGraph();

  // Here we debounce the value to avoid having too much highlights refresh when
  // moving the mouse over the graph:
  const debouncedHoveredNode = useDebounce(hoveredNode, 40);

  /**
   * Set reducers and draw functions when hover state or graph changes.
   * Using setSettings once keeps reducers in sync and avoids duplicate work.
   */
  useEffect(() => {
    const hoveredColor: string = (debouncedHoveredNode && sigma.getNodeDisplayData(debouncedHoveredNode)?.color) || "";
    const displaySizeMultiplier = IS_MOBILE ? 0.5 : 1;
    const edgeHighlightSize = IS_MOBILE ? EDGE_SIZE_HIGHLIGHT * 0.5 : EDGE_SIZE_HIGHLIGHT;

    setSettings({
      defaultDrawNodeLabel: drawLabel,
      defaultDrawNodeHover: drawHover,
      nodeReducer: (node: string, data: Attributes) => {
        const displaySize = (data.size ?? 1) * displaySizeMultiplier;
        if (debouncedHoveredNode) {
          return node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
            ? { ...data, zIndex: 1, size: displaySize }
            : { ...data, zIndex: 0, label: "", color: NODE_FADE_COLOR, highlighted: false, size: displaySize };
        }
        return { ...data, size: displaySize };
      },
      edgeReducer: (edge: string, data: Attributes) => {
        const displaySize = (data.size ?? 1) * displaySizeMultiplier;
        if (debouncedHoveredNode) {
          return graph.hasExtremity(edge, debouncedHoveredNode)
            ? { ...data, color: hoveredColor, size: edgeHighlightSize }
            : { ...data, color: EDGE_FADE_COLOR, hidden: true };
        }
        return { ...data, size: displaySize };
      },
    });
  }, [sigma, graph, debouncedHoveredNode, setSettings]);

  return <>{children}</>;
};

export default GraphSettingsController;
