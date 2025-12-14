'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TagManagement } from '@/components/tags/tag-management'
import { Settings } from 'lucide-react'

export default function TagsPage() {
  const [showManagement, setShowManagement] = useState(false)

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks with tags. Create, edit, and manage your tag collection.
          </p>
        </div>
        <Button onClick={() => setShowManagement(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Manage Tags
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Tag statistics or overview could go here */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Tag Overview</h2>
          <p className="text-muted-foreground">
            Use the &quot;Manage Tags&quot; button to create, edit, and organize your tags.
            Tags help you categorize and filter your tasks effectively.
          </p>
        </div>
      </div>

      <TagManagement
        open={showManagement}
        onOpenChange={setShowManagement}
      />
    </div>
  )
}