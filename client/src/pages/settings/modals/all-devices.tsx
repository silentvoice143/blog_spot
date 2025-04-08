import Modal from "@/components/ui-v2/modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";

function AllDevices({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} header="All Devices">
      <div className="flex flex-col min-h-[200px] max-h-[80%] overflow-auto">
        <div className="flex justify-between hover:bg-gray-tertiary px-2 py-1 rounded-md items-center">
          <p>Redmi 2A</p>
          <Button variant="outline" className="rounded-full h-8">
            Logout
          </Button>
        </div>
        <Separator className="w-1/2 self-center" />
        <div className="flex justify-between hover:bg-gray-tertiary px-2 py-1 rounded-md items-center">
          <p>Redmi 2A</p>
          <Button variant="outline" className="rounded-full h-8">
            Logout
          </Button>
        </div>
        <Separator className="w-1/2 self-center" />
        <div className="flex justify-between hover:bg-gray-tertiary px-2 py-1 rounded-md items-center">
          <p>Redmi 2A</p>
          <Button variant="outline" className="rounded-full h-8">
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AllDevices;
