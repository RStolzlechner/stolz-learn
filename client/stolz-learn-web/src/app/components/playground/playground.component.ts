import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GUID } from '../../types/guid.type';
import { ConfirmationService } from '../../services/confirmation.service';
import { StatusMessageService } from '../../services/status-message.service';
import { TestHttpService } from '../../services/http/test-http.service';
import { CourseService } from '../../services/course.service';
import { RoutingService } from '../../services/routing.service';
import { BreadcrumbLabels } from '../../translations/breadcrumb.translations';

@Component({
  selector: 'app-playground',
  template: ` <!--Test Http calls-->
    <button class="button-secondary" (click)="testApi()">Test Api</button>

    <!--Try open popover-->
    <button class="button-secondary" (click)="openConfirmation()">
      Open popover
    </button>

    <div class="flex">
      <button class="button-secondary" (click)="infoMessage()">Info</button>

      <button class="button-secondary" (click)="successMessage()">
        Success
      </button>

      <button class="button-secondary" (click)="warningMessage()">
        Warning
      </button>

      <button class="button-secondary" (click)="errorMessage()">Error</button>
    </div>

    <!-- text-header -->
    <div class="text-header">Header</div>

    <!-- text-caption -->
    <div class="text-caption">Question (Caption)</div>

    <!-- text-regular -->
    <div>Question Text (Body)</div>

    <!-- text-secondary -->
    <div class="text-secondary">Secondary Text</div>

    <!-- text-action -->
    <div class="text-action">Call to Action</div>

    <!--Table-->
    <table>
      <tr>
        <td class="w-3 flex justify-start items-start cursor-pointer">v</td>
        <td>
          <div>What is the answer to everything</div>
          <div>42</div>
        </td>
        <td class="w-5">4/5 (80%)</td>
        <td class="w-2">
          <button class="button-secondary">
            <i class="icon icon-pencil"></i>
          </button>
        </td>
      </tr>
      <tr>
        <td class="w-3 flex justify-start items-start cursor-pointer">></td>
        <td>
          <div>How much is the fish</div>
        </td>
        <td class="w-5">0/3 (0%)</td>
        <td class="w-2">
          <button class="button-secondary">
            <i class="icon icon-pencil"></i>
          </button>
        </td>
      </tr>

      <tr>
        <td class="w-3 flex justify-start items-start cursor-pointer">></td>
        <td>
          <div>Does Elvis live?</div>
        </td>
        <td class="w-7">NEW</td>
        <td class="w-2">
          <button class="button-secondary">
            <i class="icon icon-pencil"></i>
          </button>
        </td>
      </tr>
    </table>

    <!--INPUT-->
    <input placeholder="Gib was ein" />

    <!-- Buttons-->
    <div class="mt-2 flex items-center">
      <button class="mr-2 button-primary">Primary</button>
      <button class="mr-2 button-primary" disabled>Primary Disabled</button>
      <button class="mr-2 button-primary">
        <i class="icon icon-trash"></i>
        <span class="ml-2">Primary with Icon</span>
      </button>
      <button class="mr-2 button-primary">
        <i class="icon icon-trash"></i>
      </button>
    </div>

    <div class="mt-2 flex items-center">
      <button class="mr-2 button-secondary">Secondary</button>
      <button class="mr-2 button-secondary" disabled>Secondary Disabled</button>
      <button class="mr-2 button-secondary">
        <i class="icon icon-trash"></i>
        <span class="ml-2">Secondary with Icon</span>
      </button>
      <button class="mr-2 button-secondary">
        <i class="icon icon-trash"></i>
      </button>
    </div>

    <div class="mt-2 flex items-center">
      <button class="mr-2 button-danger">Danger</button>
      <button class="mr-2 button-danger" disabled>Danger Disabled</button>
      <button class="mr-2 button-danger">
        <i class="icon icon-pencil"></i>
        <span class="ml-2">Danger with Icon</span>
      </button>
      <button class="mr-2 button-danger">
        <i class="icon icon-pencil"></i>
      </button>
    </div>

    <div class="bg-surface-1">surface 1</div>
    <div class="bg-surface-2">surface 2</div>
    <div class="bg-surface-3">surface 3</div>
    <div class="bg-surface-4">surface 4</div>

    <div>mt-0</div>
    <div class="mt-1 bg-primary">mt-1</div>
    <div class="mt-2 bg-success">mt-2</div>
    <div class="mt-3 bg-warning">mt-3</div>
    <div class="mt-4 bg-danger">mt-4</div>
    <div class="mt-5">mt-5</div>
    <div class="mt-6">mt-6</div>
    <div class="mt-7">mt-7</div>
    <div class="mt-8">mt-8</div>
    <div class="mt-9">mt-9</div>
    <div class="mt-10">mt-10</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class PlaygroundComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly statusMessageService = inject(StatusMessageService);
  private readonly testHttpService = inject(TestHttpService);
  private readonly courseService = inject(CourseService);
  private readonly routingService = inject(RoutingService);

  ngOnInit() {
    this.routingService.setBreadCrumb(0, BreadcrumbLabels.playground);
  }

  openConfirmation() {
    this.confirmationService.open({
      text: 'This is only a test',
      isDanger: true,
      action: () => console.log('confirmed'),
    });
  }

  infoMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an info message',
      type: 'info',
    });
  }

  successMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an success message',
      type: 'success',
    });
  }

  warningMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an warning message',
      type: 'warning',
    });
  }

  errorMessage() {
    this.statusMessageService.addMessage({
      message: 'This is an error message',
      type: 'error',
    });
  }

  async testApi() {
    this.testHttpService.test().subscribe((r) => console.log(r));

    await this.courseService.getCourseStatistic(
      GUID('23fbd8c0-38a0-11ef-873d-0242ac120002'),
    );
  }
}
