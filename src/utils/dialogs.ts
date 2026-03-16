// src/utils/dialogs.ts
export type ConfirmIconType =
  | "question"
  | "warning"
  | "danger"
  | "info"
  | "success";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ConfirmIconType;
  showCloseButton?: boolean;
  persistent?: boolean;
}

export interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  icon?: ConfirmIconType;
}

// Icon components with improved SVG styling
const IconTemplates = {
  question: `
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  `,
  warning: `
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  `,
  danger: `
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
    </svg>
  `,
  info: `
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  `,
  success: `
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
};

// Updated icon colors using your CSS variables
const IconColors: Record<ConfirmIconType, string> = {
  question: "text-[var(--primary-500)] bg-[var(--card-secondary)]",
  warning: "text-[var(--warning)] bg-[var(--card-secondary)]",
  danger: "text-[var(--danger)] bg-[var(--card-secondary)]",
  info: "text-[var(--info)] bg-[var(--card-secondary)]",
  success: "text-[var(--success)] bg-[var(--card-secondary)]",
};

class DialogManager {
  private static instance: DialogManager;
  private container: HTMLDivElement | null = null;
  private currentConfirm: {
    element: HTMLDivElement;
    resolve: (value: boolean) => void;
  } | null = null;
  private currentAlert: {
    element: HTMLDivElement;
    resolve: () => void;
  } | null = null;

  private constructor() {
    this.injectGlobalStyles();
  }

  static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  private injectGlobalStyles(): void {
    if (document.getElementById("dialog-styles")) return;

    const styles = document.createElement("style");
    styles.id = "dialog-styles";
    styles.textContent = `
      .dialog-backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        transition: opacity 200ms ease-out;
      }
      
      .dialog-enter {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      
      .dialog-enter-active {
        opacity: 1;
        transform: scale(1) translateY(0);
        transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .dialog-exit {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .dialog-exit-active {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
        transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1), 
                    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .backdrop-enter {
        opacity: 0;
      }
      
      .backdrop-enter-active {
        opacity: 1;
        transition: opacity 200ms ease-out;
      }
      
      .backdrop-exit {
        opacity: 1;
      }
      
      .backdrop-exit-active {
        opacity: 0;
        transition: opacity 150ms ease-in;
      }
    `;
    document.head.appendChild(styles);
  }

  private createContainer(): void {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = "dialog-container";
    this.container.className =
      "fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none";
    document.body.appendChild(this.container);
  }

  private createBackdrop(): HTMLDivElement {
    const backdrop = document.createElement("div");
    backdrop.className =
      "fixed inset-0 bg-black/50 backdrop-blur-sm dialog-backdrop backdrop-enter pointer-events-auto";
    return backdrop;
  }

  private createDialogElement(): HTMLDivElement {
    const dialog = document.createElement("div");
    dialog.className = `
      bg-[var(--card-bg)] rounded-xl shadow-2xl
      w-full max-w-md
      overflow-hidden
      transform transition-all duration-200
      pointer-events-auto
      border border-[var(--border-color)]
      dialog-enter
    `;
    return dialog;
  }

  private animateIn(element: HTMLElement): void {
    requestAnimationFrame(() => {
      element.classList.remove("dialog-enter");
      element.classList.add("dialog-enter-active");
    });
  }

  private animateOut(element: HTMLElement, callback: () => void): void {
    element.classList.remove("dialog-enter-active");
    element.classList.add("dialog-exit", "dialog-exit-active");

    setTimeout(() => {
      callback();
    }, 150);
  }

  private getIconMarkup(iconType: ConfirmIconType): string {
    const colorClasses = IconColors[iconType];
    return `
      <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses} shadow-sm">
        ${IconTemplates[iconType]}
      </div>
    `;
  }

  private closeCurrentConfirm(): void {
    if (this.currentConfirm) {
      const { element, resolve } = this.currentConfirm;
      element.remove();
      resolve(false);
      this.currentConfirm = null;
    }
  }

  private closeCurrentAlert(): void {
    if (this.currentAlert) {
      const { element, resolve } = this.currentAlert;
      element.remove();
      resolve();
      this.currentAlert = null;
    }
  }

  public showConfirm(options: ConfirmOptions = {}): Promise<boolean> {
    this.closeCurrentConfirm();
    this.closeCurrentAlert();
    this.createContainer();

    return new Promise((resolve) => {
      const {
        title = "Are you sure?",
        message = "This action cannot be undone.",
        confirmText = "Confirm",
        cancelText = "Cancel",
        icon = "question",
        showCloseButton = true,
        persistent = false,
      } = options;

      const backdrop = this.createBackdrop();
      const dialog = this.createDialogElement();

      dialog.innerHTML = `
        <div class="p-6 flex items-start gap-4">
          ${this.getIconMarkup(icon)}
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] leading-6">
              ${title}
            </h3>
            <p class="mt-2 text-sm text-[var(--text-secondary)] leading-5">
              ${message}
            </p>
          </div>
          ${
            showCloseButton
              ? `
            <button type="button" class="close-btn flex-shrink-0 w-8 h-8 rounded-full text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--card-secondary)] transition-all duration-200 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          `
              : ""
          }
        </div>
        <div class="px-6 py-4 bg-[var(--card-secondary)] flex justify-end gap-3 border-t border-[var(--border-color)]">
          <button type="button" class="
            cancel-btn
            px-5 py-2 text-sm font-medium
            text-[var(--text-secondary)] hover:text-[var(--text-primary)] 
            bg-transparent hover:bg-[var(--card-bg)]
            rounded-lg transition-all duration-200
            border border-[var(--border-color)] hover:border-[var(--primary-300)]
            focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)]
          ">
            ${cancelText}
          </button>
          <button type="button" class="
            confirm-btn
            px-5 py-2 text-sm font-medium
            ${
              icon === "danger"
                ? "bg-[var(--danger)] hover:bg-[var(--danger)]/90 text-white"
                : icon === "warning"
                ? "bg-[var(--warning)] hover:bg-[var(--warning)]/90 text-white"
                : "bg-[var(--primary-500)] hover:bg-[var(--primary-600)] text-white"
            }
            rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--card-bg)]
            ${
              icon === "danger"
                ? "focus:ring-[var(--danger)]"
                : icon === "warning"
                ? "focus:ring-[var(--warning)]"
                : "focus:ring-[var(--primary-500)]"
            }
          ">
            ${confirmText}
          </button>
        </div>
      `;

      this.container!.appendChild(backdrop);
      this.container!.appendChild(dialog);
      this.currentConfirm = { element: dialog, resolve };

      requestAnimationFrame(() => {
        backdrop.classList.remove("backdrop-enter");
        backdrop.classList.add("backdrop-enter-active");
      });

      setTimeout(() => {
        this.animateIn(dialog);
      }, 50);

      const cleanup = () => {
        if (this.currentConfirm?.element === dialog) {
          this.currentConfirm = null;
        }
        backdrop.classList.remove("backdrop-enter-active");
        backdrop.classList.add("backdrop-exit-active");

        this.animateOut(dialog, () => {
          dialog.remove();
          backdrop.remove();

          if (this.container && !this.currentConfirm && !this.currentAlert) {
            this.container.remove();
            this.container = null;
          }
        });
      };

      const onConfirm = () => {
        if (!persistent) {
          cleanup();
        }
        resolve(true);
      };

      const onCancel = () => {
        if (!persistent) {
          cleanup();
        }
        resolve(false);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !persistent) {
          onCancel();
        } else if (e.key === "Enter") {
          onConfirm();
        }
      };

      dialog
        .querySelector<HTMLButtonElement>(".confirm-btn")!
        .addEventListener("click", onConfirm);
      dialog
        .querySelector<HTMLButtonElement>(".cancel-btn")!
        .addEventListener("click", onCancel);

      if (showCloseButton) {
        dialog
          .querySelector<HTMLButtonElement>(".close-btn")!
          .addEventListener("click", onCancel);
      }

      backdrop.addEventListener("click", onCancel);
      document.addEventListener("keydown", onKeyDown);

      setTimeout(() => {
        dialog.querySelector<HTMLButtonElement>(".confirm-btn")?.focus();
      }, 200);
    });
  }

  public showAlert(options: AlertOptions): Promise<void> {
    this.closeCurrentConfirm();
    this.closeCurrentAlert();
    this.createContainer();

    return new Promise((resolve) => {
      const {
        title = "Information",
        message,
        buttonText = "OK",
        icon = "info",
      } = options;

      const backdrop = this.createBackdrop();
      const dialog = this.createDialogElement();

      dialog.innerHTML = `
        <div class="p-6 flex items-start gap-4">
          ${this.getIconMarkup(icon)}
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-[var(--text-primary)] leading-6">
              ${title}
            </h3>
            <p class="mt-2 text-sm text-[var(--text-secondary)] leading-5">
              ${message}
            </p>
          </div>
        </div>
        <div class="px-6 py-4 bg-[var(--card-secondary)] flex justify-end border-t border-[var(--border-color)]">
          <button type="button" class="
            alert-btn
            px-5 py-2 text-sm font-medium
            bg-[var(--primary-500)] hover:bg-[var(--primary-600)]
            text-white
            rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:ring-offset-2 focus:ring-offset-[var(--card-bg)]
          ">
            ${buttonText}
          </button>
        </div>
      `;

      this.container!.appendChild(backdrop);
      this.container!.appendChild(dialog);
      this.currentAlert = { element: dialog, resolve };

      requestAnimationFrame(() => {
        backdrop.classList.remove("backdrop-enter");
        backdrop.classList.add("backdrop-enter-active");
      });

      setTimeout(() => {
        this.animateIn(dialog);
      }, 50);

      const cleanup = () => {
        if (this.currentAlert?.element === dialog) {
          this.currentAlert = null;
        }
        backdrop.classList.remove("backdrop-enter-active");
        backdrop.classList.add("backdrop-exit-active");

        this.animateOut(dialog, () => {
          dialog.remove();
          backdrop.remove();

          if (this.container && !this.currentConfirm && !this.currentAlert) {
            this.container.remove();
            this.container = null;
          }
        });
      };

      const onConfirm = () => {
        cleanup();
        resolve();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter") {
          onConfirm();
        }
      };

      dialog
        .querySelector<HTMLButtonElement>(".alert-btn")!
        .addEventListener("click", onConfirm);
      backdrop.addEventListener("click", onConfirm);
      document.addEventListener("keydown", onKeyDown);

      setTimeout(() => {
        dialog.querySelector<HTMLButtonElement>(".alert-btn")?.focus();
      }, 200);
    });
  }

  public closeAllDialogs(): void {
    this.closeCurrentConfirm();
    this.closeCurrentAlert();
  }
}

const dialogManager = DialogManager.getInstance();

export const showConfirm = (options?: ConfirmOptions): Promise<boolean> => {
  return dialogManager.showConfirm(options);
};

export const showAlert = (options: AlertOptions): Promise<void> => {
  return dialogManager.showAlert(options);
};

export const closeAllDialogs = (): void => {
  dialogManager.closeAllDialogs();
};

export const dialogs = {
  confirm: showConfirm,
  alert: showAlert,
  closeAll: closeAllDialogs,

  delete: (itemName?: string) =>
    showConfirm({
      title: "Delete Confirmation",
      message: itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      icon: "danger",
    }),

  success: (message: string, title: string = "Success!") =>
    showAlert({
      title,
      message,
      icon: "success",
    }),

  error: (message: string, title: string = "Error") =>
    showAlert({
      title,
      message,
      icon: "danger",
    }),

  warning: (message: string, title: string = "Warning") =>
    showAlert({
      title,
      message,
      icon: "warning",
    }),

  info: (message: string, title: string = "Information") =>
    showAlert({
      title,
      message,
      icon: "info",
    }),
};