"use client";

import { Camera, FileImage, Microphone, MusicNotes } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

/** Flexible "add material" picker: no rigid slide/list/notebook slots. */
export function MaterialPicker({
  onPhoto,
  onChooseFile,
  onRecordAudio,
  onChooseAudio,
}: {
  onPhoto: () => void;
  onChooseFile: () => void;
  onRecordAudio: () => void;
  onChooseAudio: () => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <PickerRow
        icon={<Camera size={22} weight="bold" />}
        iconBg="bg-mm-brand text-mm-on-brand"
        title="Tirar foto"
        subtitle="Do caderno, da lista ou do quadro."
        onClick={onPhoto}
      />
      <PickerRow
        icon={<FileImage size={22} weight="bold" />}
        iconBg="bg-mm-info-soft text-mm-info-ink"
        title="Escolher foto ou PDF"
        subtitle="Da galeria ou dos arquivos."
        onClick={onChooseFile}
      />
      <PickerRow
        icon={<Microphone size={22} weight="bold" />}
        iconBg="bg-mm-warn-soft text-mm-warn-ink"
        title="Gravar áudio"
        subtitle="Grava a explicação do prof na hora."
        onClick={onRecordAudio}
      />
      <PickerRow
        icon={<MusicNotes size={22} weight="bold" />}
        iconBg="bg-[rgba(206,130,255,.18)] text-[#8E3FC9]"
        title="Escolher áudio"
        subtitle="Uma aula que você já gravou."
        onClick={onChooseAudio}
      />
    </div>
  );
}

function PickerRow({
  icon,
  iconBg,
  title,
  subtitle,
  onClick,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-mm-border bg-mm-surface p-5 text-left shadow-[0_2px_0_var(--mm-border)] transition-transform active:scale-[0.98]"
    >
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="font-heading font-bold text-base text-mm-ink">{title}</div>
        <div className="text-[12.5px] text-mm-ink-2">{subtitle}</div>
      </div>
    </button>
  );
}
