"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload } from "lucide-react"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { initializeApp } from "firebase/app"
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { json } from "stream/consumers"

const firebaseConfig = {
  apiKey: "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  authDomain: "finetunemarketplace-1323f.firebaseapp.com",
  databaseURL: "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com",
  projectId: "finetunemarketplace-1323f",
  storageBucket: "finetunemarketplace-1323f.firebasestorage.app",
  messagingSenderId: "163760710265",
  appId: "1:163760710265:web:676a8e7c5116ad6661eaa8",
  measurementId: "G-2HQ21J89S1"
};


const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export function JobPopup() {
  const [file, setFile] = React.useState<File | null>(null)
  const createJob = useMutation(api.tasks.createJob)

  const submitQuery = async () => {

    if (!file) {
      alert("Please upload a training file")
      return
    }

    const config = {
      jobName: (document.getElementById("name") as HTMLInputElement)?.value,
      modelId: (document.getElementById("model_id") as HTMLInputElement)?.value,
      precision: (document.getElementById("precision") as HTMLInputElement)?.value,
      modulesLimit: Number((document.getElementById("modules_limit") as HTMLInputElement)?.value),
      loraRank: Number((document.getElementById("r") as HTMLInputElement)?.value),
      loraAlpha: Number((document.getElementById("lora_alpha") as HTMLInputElement)?.value),
      batchSize: Number((document.getElementById("batch_size") as HTMLInputElement)?.value),
      optimizer: (document.getElementById("optim") as HTMLInputElement)?.value,
      warmupSteps: Number((document.getElementById("warmup_steps") as HTMLInputElement)?.value),
      maxSteps: Number((document.getElementById("max_steps") as HTMLInputElement)?.value),
      evalSteps: Number((document.getElementById("eval_steps") as HTMLInputElement)?.value),
      learningRate: Number((document.getElementById("learning_rate") as HTMLInputElement)?.value),
      loggingSteps: Number((document.getElementById("logging_steps") as HTMLInputElement)?.value),
    }

    const random_num = Math.floor(Math.random() * 1000)
    const jsonConfig = new File([JSON.stringify(config)], "config.json", { type: "application/json" })
    const jsonFile = new File([file], "data.txt", { type: "text/plain" })


    try {

      const firebasePath = `train${random_num}`
      const storageRefConfig = ref(storage, `${firebasePath}/${jsonConfig.name}`)
      await uploadBytes(storageRefConfig, jsonConfig)

      const storageRefFile = ref(storage, `${firebasePath}/${jsonFile.name}`)
      await uploadBytes(storageRefFile, jsonFile)


      console.log('createintg job')
      await createJob({ name: config.jobName, firebasePath: `${firebasePath}`, status: "queued" })

      window.location.href = "/client";
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="text-lg px-8 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          Start a job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a Training Job</DialogTitle>
          <DialogDescription>
            Configure your AI model training parameters
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-medium">
              Job Name
            </Label>
            <Input id="name" placeholder="google/gemma-2b-it" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model_id" className="text-right font-medium">
              Model ID
            </Label>
            <Input id="model_id" placeholder="google/gemma-2b-it" className="col-span-3" />
          </div>


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precision" className="text-right font-medium">
              Precision
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="bfloat16" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="bfloat16">bfloat16</SelectItem>
                  <SelectItem value="float16">float16</SelectItem>
                  <SelectItem value="float32">float32</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modules_limit" className="text-right font-medium">
              Modules Limit
            </Label>
            <Input id="modules_limit" type="number" placeholder="10" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="r" className="text-right font-medium">
              LoRA Rank (r)
            </Label>
            <Input id="r" type="number" placeholder="2" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lora_alpha" className="text-right font-medium">
              LoRA Alpha
            </Label>
            <Input id="lora_alpha" type="number" placeholder="0.5" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="batch_size" className="text-right font-medium">
              Batch Size
            </Label>
            <Input id="batch_size" type="number" placeholder="2" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="optim" className="text-right font-medium">
              Optimizer
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="adamw_torch" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="adamw_torch">AdamW</SelectItem>
                  <SelectItem value="adafactor">Adafactor</SelectItem>
                  <SelectItem value="sgd">SGD</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warmup_steps" className="text-right font-medium">
              Warmup Steps
            </Label>
            <Input id="warmup_steps" type="number" placeholder="0.03" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max_steps" className="text-right font-medium">
              Max Steps
            </Label>
            <Input id="max_steps" type="number" placeholder="4" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eval_steps" className="text-right font-medium">
              Eval Steps
            </Label>
            <Input id="eval_steps" type="number" placeholder="2" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="learning_rate" className="text-right font-medium">
              Learning Rate
            </Label>
            <Input id="learning_rate" type="number" step="0.0001" placeholder="0.0002" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logging_steps" className="text-right font-medium">
              Logging Steps
            </Label>
            <Input id="logging_steps" type="number" placeholder="1" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right font-medium">
              Training Data
            </Label>
            <div className="col-span-3">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    TXT file (MAX. 800MB)
                  </p>
                </div>
                <Input
                  id="file"
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>



        </div>
        <DialogFooter>
          <Button type="submit" onClick={submitQuery}>Submit Training Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
