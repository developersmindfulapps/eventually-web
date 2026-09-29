"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Search, X, HelpCircle } from "lucide-react";
import { FAQ_DATA, FAQ_CATEGORIES, FAQItem } from "@/lib/faqData";

export function FullFaqSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "what-is-eventually": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, FAQItem[]> = {};
    FAQ_CATEGORIES.forEach((cat) => {
      grouped[cat.name] = [];
    });
    filteredItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [filteredItems]);

  return (
    <section aria-label="Frequently Asked Questions" className="mt-8">
      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search FAQs by keyword (e.g., blocking, RSVP, groups, chat)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-surface pl-11 pr-10 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
            }`}
          >
            All Questions ({FAQ_DATA.length})
          </button>
          {FAQ_CATEGORIES.map((cat) => {
            const count = FAQ_DATA.filter((i) => i.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border bg-surface text-text-secondary hover:bg-surface-subtle hover:text-text-primary"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized FAQ List */}
      <div className="mt-10 space-y-10">
        {FAQ_CATEGORIES.map((category) => {
          const items = itemsByCategory[category.name] || [];
          if (items.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl font-bold tracking-tight text-text-primary">
                    {category.name}
                  </h3>
                  <span className="rounded-full bg-badge-bg px-2.5 py-0.5 text-[11px] font-semibold text-badge-text border border-badge-border">
                    {items.length} {items.length === 1 ? "question" : "questions"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  {category.description}
                </p>
              </div>

              {/* Accordion Questions in Category */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "border-primary/50 bg-surface shadow-sm"
                          : "border-border bg-surface/80 hover:border-border/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading text-sm sm:text-base font-bold text-text-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <span className="pr-4">{item.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm leading-relaxed text-text-secondary border-t border-border/50 pt-3 animate-in fade-in duration-200">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-3 font-heading text-base font-semibold text-text-primary">
              No matching questions found
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Try searching with different terms or submit a support inquiry below.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
