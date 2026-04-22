import { useState } from 'react';

import { RxMagnifyingGlass } from 'react-icons/rx';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb';

import { Input, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@/shared/components/ui';
import { useUIStore } from '@/stores';
import { awsServices, genericServices } from '@/features/library/data';
import { CategoryAccordion } from './CategoryAccordion';
import { PackagedModuleCard } from '@/features/packaged-modules/components';
import { serverlessApiModule } from '@/features/packaged-modules/data/serverless-api';
import { cloudfrontS3Module } from '@/features/packaged-modules/data/cloudfront-s3';
import { apiGatewaySqsModule } from '@/features/packaged-modules/data/api-gateway-sqs';
import { ecsMicroserviceModule } from '@/features/packaged-modules/data/ecs-microservice';
import { scheduledLambdaModule } from '@/features/packaged-modules/data/scheduled-lambda';
import { snsConsumerLambdaModule } from '@/features/packaged-modules/data/sns-consumer-lambda';
import { etlPipelineModule } from '@/features/packaged-modules/data/etl-pipeline';

const packagedModules = [
  serverlessApiModule,
  cloudfrontS3Module,
  apiGatewaySqsModule,
  ecsMicroserviceModule,
  scheduledLambdaModule,
  snsConsumerLambdaModule,
  etlPipelineModule,
];

export const LibrarySidebar = () => {
  const open = useUIStore((s) => s.leftSidebarOpen);
  const toggle = useUIStore((s) => s.toggleLeftSidebar);
  const [searchQuery, setSearchQuery] = useState('');

  if (!open) {
    return (
      <div className="flex flex-col border-r border-border bg-card z-10">
        <Button variant="ghost" size="icon" onClick={toggle} className="m-1 h-7 w-7">
          <TbLayoutSidebarLeftExpand className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-52 flex-col border-r border-border bg-card z-10">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          Library
        </span>
        <Button variant="ghost" size="icon" onClick={toggle} className="h-6 w-6">
          <TbLayoutSidebarLeftCollapse className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-2 py-2">
        <div className="relative">
          <RxMagnifyingGlass className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-[11px]"
          />
        </div>
      </div>

      <Tabs defaultValue="aws" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-2 mb-1">
          <TabsTrigger value="aws" className="text-[10px] px-2">AWS</TabsTrigger>
          <TabsTrigger value="generic" className="text-[10px] px-2">Generic</TabsTrigger>
          <TabsTrigger value="modules" className="text-[10px] px-2">Modules</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="aws" className="mt-0">
            <CategoryAccordion services={awsServices} searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="generic" className="mt-0">
            <CategoryAccordion services={genericServices} searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="modules" className="mt-0 px-2 space-y-1 py-1">
            {packagedModules.map((mod) => (
              <PackagedModuleCard key={mod.id} module={mod} />
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
