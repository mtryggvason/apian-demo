"use client";
import React, { Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import { useEventListener } from "usehooks-ts";

import { CloseButton } from "@/components/buttons/CloseButton";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  afterLeave?: () => void;
  children: React.ReactNode;
}

export default function SlidePanel({
  isOpen,
  onClose,
  children,
}: SlidePanelProps) {
  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <div className="max-w-fullapian-md:pl-10  pointer-events-none fixed top-0 right-0 z-50 flex">
        <Transition.Child
          unmount={false}
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div
            className={`pointer-events-auto flex w-screen apian-md:h-screen-h-without-nav apian-md:max-w-xl lg:max-w-3xl 
                xl:max-w-5xl 
               :h-screen
                `}
          >
            <div className="relative flex h-full w-full flex-col border-l border-l-apian-menu-line-color bg-white">
              <div className="absolute right-[25px] top-[25px] z-10 [@media(max-height:750px)]:mt-nav-height">
                <CloseButton
                  onClick={onClose}
                  className="outline-none"
                  data-testid="close-panel-button"
                />
              </div>
              <div className="relative h-full w-full">{children}</div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition.Root>
  );
}
