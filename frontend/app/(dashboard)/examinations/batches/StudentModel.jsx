"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";

import StudentSelection from "./StudentSelection";
import {
  addStudentsToTheBatchTable,
  getStudentsByBatchId,
} from "@/utils/apiRequests/batch.api";

const StudentModel = ({
  feedId,
  setIsFeedOpen,
  isFeedOpen,
  studentModalRef,
  setFeedId,
  feedDegShort,
  setFeedDegShort,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const queryClient = useQueryClient();

  const { data: oldData, refetch: oldDataRefetch } = useQuery({
    queryFn: () => getStudentsByBatchId(feedId),
    queryKey: ["students", "batch", feedId],
    enabled: false,
  });

  const { status, mutate } = useMutation({
    mutationFn: addStudentsToTheBatchTable,
    onSuccess: (res) => {
      setFeedId("");
      setFeedDegShort("");
      toast(res.message);
    },
    onError: (err) => {
      console.log(err);
      toast("Operation failed");
    },
  });

  const onFormSubmitted = () => {
    mutate({ batch_id: feedId, oldData, selectedStudents });
    setSelectedStudents([]);
    setIsFeedOpen(false);
  };

  const onFormReset = () => {
    setSelectedStudents(oldData);
  };

  useEffect(() => {
    console.log(oldData);
    setSelectedStudents(oldData);
  }, [oldData]);

  return (
    <>
      {isFeedOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={studentModalRef}
            className={`sm:max-w-[575px] w-full transition-all duration-300 bg-white rounded-lg shadow-lg p-6 h-[95vh]`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Batch</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsFeedOpen(false);
                  onFormReset();
                  setFeedId("");
                  setFeedDegShort("");
                }}
              />
            </div>
            <div className="w-full flex flex-col justify-between h-[80vh]">
              <StudentSelection
                setSelectedStudents={setSelectedStudents}
                selectedStudents={selectedStudents}
                feedDegShort={feedDegShort}
                oldDataRefetch={oldDataRefetch}
                feedId={feedId}
              />
              <div className="flex justify-between space-x-2 mt-4">
                <Button
                  type="button"
                  variant="warning"
                  onClick={() => onFormReset()}
                >
                  Reset
                </Button>
                <Button type="button" onClick={onFormSubmitted}>
                  Add students to the batch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentModel;