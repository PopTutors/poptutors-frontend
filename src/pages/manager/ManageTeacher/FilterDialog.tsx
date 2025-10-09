// src/pages/manager/ManageTeacher/components/FilterDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui';
import { type Filters } from './types';

export default function FilterDialog({
    open,
    tempFilters,
    setTempFilters,
    onApply,
    onReset,
}: {
    open: boolean;
    tempFilters: Filters;
    setTempFilters: (f: Filters | ((prev: Filters) => Filters)) => void;
    onApply: () => void;
    onReset: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="w-full sm:max-w-md max-h-[70vh] overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="overflow-y-auto p-6 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-lg">Filter teachers</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <select value={tempFilters.status} onChange={(e) => setTempFilters((s) => ({ ...s, status: e.target.value as Filters['status'] }))} className="h-10 border border-border  px-3">
                                <option value="all">All</option>
                                <option value="active">Active (not blocked)</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Minimum rating</Label>
                            <select value={tempFilters.minRating ?? ''} onChange={(e) => setTempFilters((s) => ({ ...s, minRating: e.target.value === '' ? null : Number(e.target.value) }))} className="h-10 border border-border  px-3">
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Subject / keyword</Label>
                            <Input placeholder="e.g. assignments, physics" value={tempFilters.subject} onChange={(e) => setTempFilters((s) => ({ ...s, subject: e.target.value }))} className="w-full" />
                        </div>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card flex-shrink-0">
                        <Button variant="outline" className="m-0 px-[24px] py-[12px] w-[164px] h-[48px] font-inter rounded-none text-[16px] font-semibold" onClick={onReset}>Reset</Button>
                        <Button onClick={onApply} className="m-0 px-[24px] py-[12px] w-[164px] h-[48px] font-inter rounded-none text-[16px] font-semibold bg-[#019ACB]">Apply</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
