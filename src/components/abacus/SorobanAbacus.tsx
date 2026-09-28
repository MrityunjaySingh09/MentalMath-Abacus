'use client';

import React, { useState, useEffect } from 'react';

export interface RodState {
  upperBead: boolean; // true = down against beam (value 5)
  lowerBeads: number; // 0 to 4 up against beam (value 1 each)
}

interface SorobanAbacusProps {
  numRods?: number;
  initialValue?: number;
  onChangeValue?: (val: number) => void;
  interactive?: boolean;
  opacity?: number;
  hidden?: boolean;
  guidedStep?: { rodIndex: number; action: 'UPPER_TOGGLE' | 'LOWER_SET'; targetLower: number };
}

const PLACE_VALUE_LABELS = ['1M', '100K', '10K', '1K', '100s', '10s', '1s'];

export const SorobanAbacus: React.FC<SorobanAbacusProps> = ({
  numRods = 7,
  initialValue = 0,
  onChangeValue,
  interactive = true,
  opacity = 1,
  hidden = false,
  guidedStep,
}) => {
  const valueToRods = (val: number): RodState[] => {
    const str = val.toString();
    const rods: RodState[] = Array(numRods)
      .fill(null)
      .map(() => ({ upperBead: false, lowerBeads: 0 }));

    for (let i = 0; i < Math.min(str.length, numRods); i++) {
      const digit = parseInt(str[str.length - 1 - i], 10);
      const rodIndex = numRods - 1 - i;
      rods[rodIndex] = {
        upperBead: digit >= 5,
        lowerBeads: digit % 5,
      };
    }
    return rods;
  };

  const rodsToValue = (rodStates: RodState[]): number => {
    let total = 0;
    for (let i = 0; i < rodStates.length; i++) {
      const place = Math.pow(10, rodStates.length - 1 - i);
      const val = (rodStates[i].upperBead ? 5 : 0) + rodStates[i].lowerBeads;
      total += val * place;
    }
    return total;
  };

  const [rods, setRods] = useState<RodState[]>(() => valueToRods(initialValue));

  useEffect(() => {
    setRods(valueToRods(initialValue));
  }, [initialValue, numRods]);

  const toggleUpperBead = (rodIndex: number) => {
    if (!interactive) return;
    const newRods = [...rods];
    newRods[rodIndex] = {
      ...newRods[rodIndex],
      upperBead: !newRods[rodIndex].upperBead,
    };
    setRods(newRods);
    const val = rodsToValue(newRods);
    if (onChangeValue) onChangeValue(val);
  };

  const setLowerBeads = (rodIndex: number, count: number) => {
    if (!interactive) return;
    const newRods = [...rods];
    newRods[rodIndex] = {
      ...newRods[rodIndex],
      lowerBeads: newRods[rodIndex].lowerBeads === count ? count - 1 : count,
    };
    setRods(newRods);
    const val = rodsToValue(newRods);
    if (onChangeValue) onChangeValue(val);
  };

  const currentValue = rodsToValue(rods);

  if (hidden) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-[#FFFDF8] rounded-2xl border border-[#D9D5CA] p-6 text-center space-y-2 select-none">
        <div className="w-12 h-12 rounded-xl bg-[#E5EEE9] border border-[#C9D8D0] flex items-center justify-center text-[#173F35] mx-auto">
          <span className="text-xl font-bold font-mono">🧠</span>
        </div>
        <span className="text-base font-bold text-[#173F35] font-serif">Internalized Bead Visualization</span>
        <span className="text-xs text-[#68736D] max-w-sm font-sans">
          The physical abacus has disappeared. Feel and manipulate the bead positions in your internal spatial memory.
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ opacity }}
      className="w-full max-w-4xl bg-[#173F35] border-4 border-[#0F2C25] rounded-2xl p-5 shadow-md transition-all duration-300 select-none"
    >
      {/* Abacus Frame Header */}
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-widest text-[#FFFDF8] font-bold font-mono">
            Soroban Model
          </span>
          <span className="px-2.5 py-0.5 bg-[#23594A] text-[#FFFDF8] rounded-md font-mono text-[11px] font-semibold">
            {numRods} Rods
          </span>
        </div>
        <div className="text-xl font-bold font-mono text-[#FFFDF8] bg-[#0F2C25] px-3.5 py-1 rounded-lg border border-[#23594A]">
          Value: {currentValue}
        </div>
      </div>

      {/* Main Soroban Board */}
      <div className="relative bg-[#FFFDF8] rounded-xl p-5 border-2 border-[#D9D5CA] overflow-x-auto shadow-inner">
        <div className="flex justify-around items-stretch min-w-[420px] h-64">
          {rods.map((rod, rIdx) => {
            const isGuided = guidedStep?.rodIndex === rIdx;
            const placeLabel = PLACE_VALUE_LABELS[PLACE_VALUE_LABELS.length - numRods + rIdx] || '';

            return (
              <div key={rIdx} className="relative flex flex-col items-center justify-between w-12 h-full">
                {/* Vertical Metallic Rod Pole */}
                <div className="absolute top-0 bottom-0 w-1.5 bg-[#A3B1A8] rounded-full left-1/2 -translate-x-1/2 z-0" />

                {/* Upper Deck (Value 5 - Terracotta Bead) */}
                <div className="relative z-10 w-full h-16 flex flex-col justify-start pt-1">
                  <button
                    type="button"
                    onClick={() => toggleUpperBead(rIdx)}
                    disabled={!interactive}
                    title={`Rod ${rIdx + 1}: Toggle 5`}
                    className={`w-10 h-6.5 rounded-md shadow-sm transition-all duration-200 left-1/2 -translate-x-1/2 relative border ${
                      rod.upperBead
                        ? 'translate-y-8 bg-[#C96F4A] border-[#944426] shadow-md'
                        : 'bg-[#E2EEE9] border-[#A3B1A8] hover:bg-[#D3E0D8]'
                    } ${isGuided && guidedStep?.action === 'UPPER_TOGGLE' ? 'ring-2 ring-[#C96F4A] animate-pulse' : ''}`}
                  />
                </div>

                {/* Horizontal Reckoning Beam */}
                <div className="relative z-20 w-full h-3 bg-[#173F35] border-y border-[#0F2C25] rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#C96F4A] rounded-full" />
                </div>

                {/* Lower Deck (4 Beads - Deep Sage Beads) */}
                <div className="relative z-10 w-full h-36 flex flex-col justify-end pb-1 space-y-1">
                  {[1, 2, 3, 4].map((bNum) => {
                    const isActive = rod.lowerBeads >= bNum;
                    return (
                      <button
                        key={bNum}
                        type="button"
                        onClick={() => setLowerBeads(rIdx, bNum)}
                        disabled={!interactive}
                        title={`Rod ${rIdx + 1}: Set ${bNum}`}
                        className={`w-10 h-6.5 rounded-md shadow-sm transition-all duration-200 left-1/2 -translate-x-1/2 relative border ${
                          isActive
                            ? '-translate-y-6 bg-[#537063] border-[#3D5449] shadow-md'
                            : 'bg-[#E2EEE9] border-[#A3B1A8] hover:bg-[#D3E0D8]'
                        } ${isGuided && guidedStep?.action === 'LOWER_SET' ? 'ring-2 ring-[#537063] animate-pulse' : ''}`}
                      />
                    );
                  })}
                </div>

                {/* Place Value Label Marker Underneath */}
                <span className="text-[10px] font-mono font-bold text-[#68736D] mt-1">
                  {placeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Control */}
      {interactive && (
        <div className="flex justify-between items-center mt-3 px-1">
          <span className="text-[11px] font-mono text-[#E8EFEB]">
            Click beads to toggle value
          </span>
          <button
            type="button"
            onClick={() => {
              const resetRods = Array(numRods)
                .fill(null)
                .map(() => ({ upperBead: false, lowerBeads: 0 }));
              setRods(resetRods);
              if (onChangeValue) onChangeValue(0);
            }}
            className="px-3 py-1 bg-[#0F2C25] hover:bg-[#23594A] text-[#FFFDF8] text-xs font-mono font-semibold rounded-lg border border-[#23594A] transition"
          >
            Reset Board
          </button>
        </div>
      )}
    </div>
  );
};
