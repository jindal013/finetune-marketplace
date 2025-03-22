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

export function JobPopup() {
  const [file, setFile] = React.useState<File | null>(null)

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
            <Input id="name" placeholder="my-training-job" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model_id" className="text-right font-medium">
              Model ID
            </Label>
            <Input id="model_id" placeholder="facebook/opt-350m" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-medium">
              Architecture
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an architecture" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Neural Networks</SelectLabel>
                  <SelectItem value="densenet">DenseNet</SelectItem>
                  <SelectItem value="alexnet">AlexNet</SelectItem>
                  <SelectItem value="vggnet">VGGNet</SelectItem>
                  <SelectItem value="resnet">ResNet</SelectItem>
                  <SelectItem value="googlenet">GoogleNet</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
            <Input id="modules_limit" type="number" placeholder="8" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="r" className="text-right font-medium">
              LoRA Rank (r)
            </Label>
            <Input id="r" type="number" placeholder="16" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lora_alpha" className="text-right font-medium">
              LoRA Alpha
            </Label>
            <Input id="lora_alpha" type="number" placeholder="32" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="batch_size" className="text-right font-medium">
              Batch Size
            </Label>
            <Input id="batch_size" type="number" placeholder="4" className="col-span-3" />
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
            <Input id="warmup_steps" type="number" placeholder="100" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max_steps" className="text-right font-medium">
              Max Steps
            </Label>
            <Input id="max_steps" type="number" placeholder="1000" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eval_steps" className="text-right font-medium">
              Eval Steps
            </Label>
            <Input id="eval_steps" type="number" placeholder="100" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="learning_rate" className="text-right font-medium">
              Learning Rate
            </Label>
            <Input id="learning_rate" type="number" step="0.0001" placeholder="0.0003" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logging_steps" className="text-right font-medium">
              Logging Steps
            </Label>
            <Input id="logging_steps" type="number" placeholder="10" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="output" className="text-right font-medium">
              Output Directory
            </Label>
            <Input id="output" placeholder="./output" className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="overwrite" className="text-right font-medium">
              Overwrite
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch id="overwrite" />
              <Label htmlFor="overwrite">Allow overwriting existing files</Label>
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button type="submit">Submit Training Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
